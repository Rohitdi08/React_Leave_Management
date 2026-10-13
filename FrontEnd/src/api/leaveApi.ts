import type { Leave } from "../types";
import type { ApplyLeaveRequest, LeaveDto } from "./dto";
import { apiFetch } from "./http";
import { toLeave } from "./mappers";

/* LeaveSer service (http://localhost:5160). The employee id always comes from the JWT. */

/* POST /api/leave/apply -> 400 for past dates, To < From, or overlapping leave. */
export async function applyLeave(request: ApplyLeaveRequest): Promise<number> {
    const result = await apiFetch<{ message: string; leaveId: number }>("/api/leave/apply", {
        method: "POST",
        body: request
    });
    return result.leaveId;
}

/* GET /api/leave/my-leaves - the logged-in employee's leaves, newest applied first. */
export async function getMyLeaves(): Promise<Leave[]> {
    const leaves = await apiFetch<LeaveDto[]>("/api/leave/my-leaves");
    return leaves.map(toLeave);
}

/* GET /api/leave/pending - Admin only (403 otherwise). */
export async function getPendingLeaves(): Promise<Leave[]> {
    const leaves = await apiFetch<LeaveDto[]>("/api/leave/pending");
    return leaves.map(toLeave);
}

/* GET /api/leave/history - Admin only; approved/rejected leaves, latest action first. */
export async function getPreviousHistory(): Promise<Leave[]> {
    const leaves = await apiFetch<LeaveDto[]>("/api/leave/history");
    return leaves.map(toLeave);
}

/* PUT /api/leave/approve/{id} - Admin only; remark optional. Returns the updated leave. */
export async function approveLeave(leaveId: number, remark: string): Promise<Leave> {
    const result = await apiFetch<{ message: string; leave: LeaveDto }>(`/api/leave/approve/${leaveId}`, {
        method: "PUT",
        body: { adminRemark: remark }
    });
    return toLeave(result.leave);
}

/* PUT /api/leave/reject/{id} - Admin only; remark required. Returns the updated leave. */
export async function rejectLeave(leaveId: number, remark: string): Promise<Leave> {
    const result = await apiFetch<{ message: string; leave: LeaveDto }>(`/api/leave/reject/${leaveId}`, {
        method: "PUT",
        body: { adminRemark: remark }
    });
    return toLeave(result.leave);
}
