/* Mirrors the BRD "User" table (section 7.1), as returned by GET /api/employee (no password). */
export type Role = "Employee" | "Admin";

export type User = {
    userId: number;
    employeeName: string;
    email: string;
    mobileNo: string;
    department: string;
    role: Role;
    isActive: boolean;
    createdDate: string; // yyyy-mm-dd
};

/* Mirrors the BRD "Leave" table (section 7.2). */
export type LeaveStatus = "Pending" | "Approved" | "Rejected";

export type Leave = {
    leaveId: number;
    employeeId: number;
    leaveType: string;
    fromDate: string; // yyyy-mm-dd
    toDate: string; // yyyy-mm-dd
    reason: string;
    status: LeaveStatus;
    adminRemark: string;
    appliedDate: string; // yyyy-mm-dd
    actionDate: string | null; // yyyy-mm-dd
};
