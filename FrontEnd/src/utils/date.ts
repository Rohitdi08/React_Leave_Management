/* Today's date as yyyy-mm-dd in local time. */
export function today(): string {
    const d = new Date();
    const month = String(d.getMonth() + 1).padStart(2, "0");
    const day = String(d.getDate()).padStart(2, "0");
    return `${d.getFullYear()}-${month}-${day}`;
}

/* yyyy-mm-dd -> dd-mm-yyyy (format used in the BRD). */
export function formatDate(value: string | null): string {
    if (!value) {
        return "-";
    }
    const [year, month, day] = value.split("-");
    return `${day}-${month}-${year}`;
}

/* Inclusive number of days between two yyyy-mm-dd dates. */
export function dayCount(from: string, to: string): number {
    const ms = Date.parse(to) - Date.parse(from);
    return Math.round(ms / 86_400_000) + 1;
}
