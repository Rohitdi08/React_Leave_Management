import { clearSession, getSession, saveSession } from "./session";

/*
 * Thin wrapper around fetch() used by every API call:
 * - sends/parses JSON and adds "Authorization: Bearer <token>";
 * - on 401 refreshes the access token once (POST /api/Auth/Refresh) and retries;
 * - turns every error shape the backend returns into one ApiError.
 *
 * Paths are relative ("/api/leave/..."): in development Vite proxies them to the right
 * service (see vite.config.ts), so the browser never makes a cross-origin request.
 */

export class ApiError extends Error {
    status: number;
    /* Per-field messages from ASP.NET model validation, keyed by camelCase field name. */
    fieldErrors: Record<string, string>;

    constructor(message: string, status: number, fieldErrors: Record<string, string> = {}) {
        super(message);
        this.name = "ApiError";
        this.status = status;
        this.fieldErrors = fieldErrors;
    }
}

type RequestOptions = {
    method?: "GET" | "POST" | "PUT";
    body?: unknown;
    /* false for login/register, which must not send or refresh a token. */
    auth?: boolean;
};

let onSessionExpired: () => void = () => {};

/* AppProvider registers a handler that logs the user out when the refresh token is no longer valid. */
export function setSessionExpiredHandler(handler: () => void): void {
    onSessionExpired = handler;
}

export async function apiFetch<T>(path: string, { method = "GET", body, auth = true }: RequestOptions = {}): Promise<T> {
    let response = await send(path, method, body, auth);

    if (response.status === 401 && auth) {
        if (await refreshAccessToken()) {
            response = await send(path, method, body, auth);
        }
        if (response.status === 401) {
            clearSession();
            onSessionExpired();
            throw new ApiError("Your session has expired. Please log in again.", 401);
        }
    }

    if (!response.ok) {
        throw await toApiError(response);
    }

    const text = await response.text();
    return (text ? JSON.parse(text) : undefined) as T;
}

/* Message to show for any error thrown by an API call. */
export function errorMessage(error: unknown): string {
    return error instanceof Error ? error.message : "Something went wrong. Please try again.";
}

async function send(path: string, method: string, body: unknown, auth: boolean): Promise<Response> {
    const headers: Record<string, string> = { Accept: "application/json" };
    if (body !== undefined) {
        headers["Content-Type"] = "application/json";
    }

    const token = getSession()?.accessToken;
    if (auth && token) {
        headers.Authorization = `Bearer ${token}`;
    }

    try {
        return await fetch(path, {
            method,
            headers,
            body: body === undefined ? undefined : JSON.stringify(body)
        });
    } catch {
        throw new ApiError("Cannot reach the server. Check that the API services are running.", 0);
    }
}

/* Several calls can get a 401 at once - they share one refresh request. */
let refreshing: Promise<boolean> | null = null;

function refreshAccessToken(): Promise<boolean> {
    refreshing ??= requestNewAccessToken().finally(() => {
        refreshing = null;
    });
    return refreshing;
}

async function requestNewAccessToken(): Promise<boolean> {
    const session = getSession();
    if (!session?.user) {
        return false;
    }

    try {
        /* Auth1 stores the refresh token against the user's email. */
        const response = await fetch("/api/Auth/Refresh", {
            method: "POST",
            headers: { "Content-Type": "application/json", Accept: "application/json" },
            body: JSON.stringify({ username: session.user.email, token: session.refreshToken })
        });
        if (!response.ok) {
            return false;
        }

        const data = (await response.json()) as { accesstoken: string };
        saveSession({ ...session, accessToken: data.accesstoken });
        return true;
    } catch {
        return false;
    }
}

/*
 * The services return errors in three shapes:
 * - middleware exceptions: { statusCode, message }
 * - BadRequest("...") / Unauthorized("..."): a plain text body
 * - [ApiController] model validation: ProblemDetails { title, errors: { Field: ["msg"] } }
 */
async function toApiError(response: Response): Promise<ApiError> {
    const text = await response.text();

    let data: unknown = text;
    try {
        data = JSON.parse(text);
    } catch {
        /* Plain text body. */
    }

    if (typeof data === "string" && data.trim()) {
        return new ApiError(data, response.status);
    }

    if (data && typeof data === "object") {
        const body = data as { message?: string; title?: string; errors?: Record<string, string[]> };

        const fieldErrors: Record<string, string> = {};
        for (const [field, messages] of Object.entries(body.errors ?? {})) {
            const key = field.charAt(0).toLowerCase() + field.slice(1);
            fieldErrors[key] = messages[0];
        }

        const message = body.message ?? Object.values(fieldErrors)[0] ?? body.title;
        if (message) {
            return new ApiError(message, response.status, fieldErrors);
        }
    }

    return new ApiError(defaultMessage(response.status), response.status);
}

function defaultMessage(status: number): string {
    switch (status) {
        case 401:
            return "Please log in again.";
        case 403:
            return "You do not have permission to do this.";
        case 404:
            return "The requested record was not found.";
        default:
            return status >= 500
                ? "Server error. Check that the API services are running."
                : `Request failed (${status}).`;
    }
}
