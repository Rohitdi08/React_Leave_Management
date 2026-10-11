import type { LeaveStatus } from "../types";

/*
 * Request/response shapes exactly as the ASP.NET Core services send them
 * (System.Text.Json camelCase: "UserID" -> "userID", "Accesstoken" -> "accesstoken").
 */

/* Auth1: POST /api/Auth/Register body (EmployeeList). */
export type RegisterRequest = {
    employeeName: string;
    email: string;
    mobileNo: string;
    department: number;
    password: string;
    role: number;
    isActive: number;
};

/* Auth1: POST /api/Auth/Login response. */
export type LoginResponse = {
    accesstoken: string;
    refreshtoken: string;
    userRole: number;
};

/* EmployeeLeave: GET /api/employee and /api/employee/{id} (EmployeeDto). */
export type EmployeeDto = {
    userID: number;
    employeeName: string;
    email: string;
    mobileNo: string;
    department: number;
    role: number;
    isActive: number;
    createdDate: string; // ISO date-time
};

/* LeaveSer: LeaveRequest. */
export type LeaveDto = {
    leaveId: number;
    employeeId: number;
    leaveType: string;
    fromDate: string; // ISO date-time
    toDate: string;
    reason: string;
    status: LeaveStatus;
    adminRemark: string | null;
    appliedDate: string;
    actionDate: string | null;
};

/* LeaveSer: POST /api/leave/apply body. */
export type ApplyLeaveRequest = {
    leaveType: string;
    fromDate: string; // yyyy-mm-dd
    toDate: string;
    reason: string;
};
