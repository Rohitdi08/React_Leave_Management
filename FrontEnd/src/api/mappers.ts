import { departmentName, ROLE_IDS } from "../data/lookups";
import type { Leave, User } from "../types";
import type { EmployeeDto, LeaveDto } from "./dto";

/* API DTOs -> the front-end models in src/types, so pages never deal with ids/ints/ISO strings. */

/* "2026-10-15T00:00:00" -> "2026-10-15" */
function toDateOnly(value: string): string {
    return value.slice(0, 10);
}

export function toUser(dto: EmployeeDto): User {
    return {
        userId: dto.userID,
        employeeName: dto.employeeName,
        email: dto.email,
        mobileNo: dto.mobileNo,
        department: departmentName(dto.department),
        role: dto.role === ROLE_IDS.Admin ? "Admin" : "Employee",
        isActive: dto.isActive !== 0,
        createdDate: toDateOnly(dto.createdDate)
    };
}

export function toLeave(dto: LeaveDto): Leave {
    return {
        leaveId: dto.leaveId,
        employeeId: dto.employeeId,
        leaveType: dto.leaveType,
        fromDate: toDateOnly(dto.fromDate),
        toDate: toDateOnly(dto.toDate),
        reason: dto.reason,
        status: dto.status,
        adminRemark: dto.adminRemark ?? "",
        appliedDate: toDateOnly(dto.appliedDate),
        actionDate: dto.actionDate ? toDateOnly(dto.actionDate) : null
    };
}
