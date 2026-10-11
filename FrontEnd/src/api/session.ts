import type { User } from "../types";

/*
 * Tokens from Auth1 (POST /api/Auth/Login) + the logged-in user, kept in localStorage
 * so a page refresh does not log the user out.
 */
export type Session = {
    accessToken: string;
    refreshToken: string;
    user: User | null;
};

const STORAGE_KEY = "leave-management.session";

export function getSession(): Session | null {
    try {
        const raw = localStorage.getItem(STORAGE_KEY);
        return raw ? (JSON.parse(raw) as Session) : null;
    } catch {
        return null;
    }
}

export function saveSession(session: Session): void {
    try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(session));
    } catch {
        /* Storage blocked (private mode) - the session then lasts until refresh. */
    }
}

export function clearSession(): void {
    try {
        localStorage.removeItem(STORAGE_KEY);
    } catch {
        /* Nothing stored. */
    }
}
