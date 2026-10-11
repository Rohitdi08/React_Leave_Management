/*
 * Lookup values shared by the UI and the API mapping.
 * The backend stores Department and Role as numbers and has no master endpoint for them,
 * so the ids below must match the values used in the LeaveManagement database.
 */

/* Employees.Department ids - ASSUMED order, change to match the database. */
export const DEPARTMENTS = [
    { id: 1, name: "IT" },
    { id: 2, name: "HR" },
    { id: 3, name: "Finance" },
    { id: 4, name: "Sales" },
    { id: 5, name: "Operations" }
];

/* Employees.Role values. Admin = 1 comes from LeaveSer appsettings "Roles:Admin"; Employee = 2 is assumed. */
export const ROLE_IDS = {
    Admin: 1,
    Employee: 2
} as const;

/* Leave.LeaveType is free text in the API (max 50 characters). */
export const LEAVE_TYPES = ["Casual Leave", "Sick Leave", "Earned Leave", "Unpaid Leave"];

export function departmentName(id: number): string {
    return DEPARTMENTS.find(d => d.id === id)?.name ?? `Department ${id}`;
}
