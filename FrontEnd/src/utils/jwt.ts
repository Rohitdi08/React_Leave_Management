/* Reads the payload of a JWT (no signature check - the API validates the token). */
export function decodeJwt(token: string): Record<string, unknown> {
    const payload = token.split(".")[1] ?? "";
    const base64 = payload.replace(/-/g, "+").replace(/_/g, "/");
    const padded = base64.padEnd(Math.ceil(base64.length / 4) * 4, "=");
    return JSON.parse(atob(padded)) as Record<string, unknown>;
}

/*
 * Auth1 puts UserID in the ClaimTypes.NameIdentifier claim. JwtSecurityTokenHandler writes it
 * as "nameid", but the long claim URI is checked too in case that mapping is turned off.
 */
export function readUserId(token: string): number {
    const claims = decodeJwt(token);
    const value = claims.nameid ?? claims["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier"];
    const id = Number(value);
    if (!Number.isInteger(id) || id <= 0) {
        throw new Error("Login succeeded but the token has no user id.");
    }
    return id;
}
