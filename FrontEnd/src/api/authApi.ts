import type { User } from "../types";
import { readUserId } from "../utils/jwt";
import type { LoginResponse, RegisterRequest } from "./dto";
import { getEmployeeById } from "./employeeApi";
import { ApiError, apiFetch } from "./http";
import { clearSession, saveSession } from "./session";

/* Auth1 service (http://localhost:5101). */

/* POST /api/Auth/Register -> 409 when the email is already registered. */
export async function register(request: RegisterRequest): Promise<string> {
    const result = await apiFetch<{ message: string }>("/api/Auth/Register", {
        method: "POST",
        body: request,
        auth: false
    });
    return result.message;
}

/*
 * 1. POST /api/Auth/Login with { uname, pass } -> access + refresh token.
 * 2. Read UserID from the token and load the profile from GET /api/employee/{id}
 *    (the login response carries no name/department).
 * 3. Block inactive accounts - Auth1 itself does not check IsActive.
 */
export async function login(email: string, password: string): Promise<User> {
    const tokens = await apiFetch<LoginResponse>("/api/Auth/Login", {
        method: "POST",
        body: { uname: email, pass: password },
        auth: false
    });

    saveSession({ accessToken: tokens.accesstoken, refreshToken: tokens.refreshtoken, user: null });

    try {
        const user = await getEmployeeById(readUserId(tokens.accesstoken));

        if (!user.isActive) {
            throw new ApiError("Your account is inactive. Please contact the admin.", 403);
        }

        saveSession({ accessToken: tokens.accesstoken, refreshToken: tokens.refreshtoken, user });
        return user;
    } catch (error) {
        clearSession();
        throw error;
    }
}

/* Auth1 has no logout endpoint - forgetting the tokens is enough. */
export function logout(): void {
    clearSession();
}
