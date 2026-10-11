import { useState } from "react";
import { approveLeave, rejectLeave } from "../../api/leaveApi";
import StatusBadge from "../../components/StatusBadge";
import { useApp } from "../../store/AppContext";
import type { Leave } from "../../types";
import { formatDate } from "../../utils/date";
import LeaveActionDialog from "./LeaveActionDialog";

type PendingAction = {
    leave: Leave;
    action: "Approve" | "Reject";
};

type LeaveRequestsProps = {
    loading: boolean;
    onRefresh: () => void;
};

/*
 * Lists GET /api/leave/pending. LeaveSer has no "all leaves" endpoint, so requests the admin
 * approves/rejects here stay in the list with their new status until the next refresh.
 */
function LeaveRequests({ loading, onRefresh }: LeaveRequestsProps) {
    const { state, dispatch } = useApp();
    const [pendingAction, setPendingAction] = useState<PendingAction | null>(null);

    const employeeName = (id: number) =>
        state.users.find(u => u.userId === id)?.employeeName ?? `#${id}`;

    const leaves = [...state.leaves].sort((a, b) => a.fromDate.localeCompare(b.fromDate));

    /* PUT /api/leave/approve|reject/{id}; an error is thrown back to the dialog, which shows it. */
    const handleConfirm = async (remark: string) => {
        if (!pendingAction) {
            return;
        }
        const { leave, action } = pendingAction;
        const updated = action === "Approve"
            ? await approveLeave(leave.leaveId, remark)
            : await rejectLeave(leave.leaveId, remark);

        dispatch({ type: "UPDATE_LEAVE", leave: updated });
        setPendingAction(null);
    };

    return (
        <div className="card">
            <div className="card-header">
                <h2>Pending Leave Requests</h2>
                <button className="btn btn-outline btn-sm" onClick={onRefresh} disabled={loading}>
                    {loading ? "Loading..." : "Refresh"}
                </button>
            </div>

            {loading && leaves.length === 0 ? (
                <p className="empty">Loading leave requests...</p>
            ) : leaves.length === 0 ? (
                <p className="empty">No pending leave requests.</p>
            ) : (
                <div className="table-wrapper">
                    <table className="table">
                        <thead>
                            <tr>
                                <th>Employee</th>
                                <th>Leave Type</th>
                                <th>From Date</th>
                                <th>To Date</th>
                                <th>Reason</th>
                                <th>Applied On</th>
                                <th>Status</th>
                                <th>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {leaves.map(leave => (
                                <tr key={leave.leaveId}>
                                    <td>
                                        {employeeName(leave.employeeId)}
                                        <div className="muted small">ID {leave.employeeId}</div>
                                    </td>
                                    <td>{leave.leaveType}</td>
                                    <td>{formatDate(leave.fromDate)}</td>
                                    <td>{formatDate(leave.toDate)}</td>
                                    <td>{leave.reason}</td>
                                    <td>{formatDate(leave.appliedDate)}</td>
                                    <td><StatusBadge status={leave.status} /></td>
                                    <td>
                                        {leave.status === "Pending" ? (
                                            <div className="actions">
                                                <button
                                                    className="btn btn-success btn-sm"
                                                    onClick={() => setPendingAction({ leave, action: "Approve" })}
                                                >
                                                    Approve
                                                </button>
                                                <button
                                                    className="btn btn-danger btn-sm"
                                                    onClick={() => setPendingAction({ leave, action: "Reject" })}
                                                >
                                                    Reject
                                                </button>
                                            </div>
                                        ) : (
                                            <span className="muted small">
                                                {formatDate(leave.actionDate)}
                                                {leave.adminRemark && <div>{leave.adminRemark}</div>}
                                            </span>
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            {pendingAction && (
                <LeaveActionDialog
                    leave={pendingAction.leave}
                    employeeName={employeeName(pendingAction.leave.employeeId)}
                    action={pendingAction.action}
                    onConfirm={handleConfirm}
                    onClose={() => setPendingAction(null)}
                />
            )}
        </div>
    );
}

export default LeaveRequests;
