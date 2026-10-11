import StatusBadge from "../../components/StatusBadge";
import type { Leave } from "../../types";
import { formatDate } from "../../utils/date";

function MyLeaves({ leaves, loading }: { leaves: Leave[]; loading: boolean }) {
    return (
        <div className="card">
            <h2>My Leave Requests</h2>

            {loading && leaves.length === 0 ? (
                <p className="empty">Loading your leave requests...</p>
            ) : leaves.length === 0 ? (
                <p className="empty">You have not applied for any leave yet.</p>
            ) : (
                <div className="table-wrapper">
                    <table className="table">
                        <thead>
                            <tr>
                                <th>Leave Type</th>
                                <th>From Date</th>
                                <th>To Date</th>
                                <th>Reason</th>
                                <th>Applied On</th>
                                <th>Status</th>
                                <th>Admin Remark</th>
                            </tr>
                        </thead>
                        <tbody>
                            {leaves.map(leave => (
                                <tr key={leave.leaveId}>
                                    <td>{leave.leaveType}</td>
                                    <td>{formatDate(leave.fromDate)}</td>
                                    <td>{formatDate(leave.toDate)}</td>
                                    <td>{leave.reason}</td>
                                    <td>{formatDate(leave.appliedDate)}</td>
                                    <td><StatusBadge status={leave.status} /></td>
                                    <td>{leave.adminRemark || "-"}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
}

export default MyLeaves;
