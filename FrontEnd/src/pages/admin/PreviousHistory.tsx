import StatusBadge from "../../components/StatusBadge";
import { useApp } from "../../store/AppContext";
import { formatDate } from "../../utils/date";

type PreviousHistoryProps = {
    loading: boolean;
    onRefresh: () => void;
};

/* Lists GET /api/leave/history: leaves the admin has already approved or rejected. */
function PreviousHistory({ loading, onRefresh }: PreviousHistoryProps) {
    const { state } = useApp();

    const employeeName = (id: number) =>
        state.users.find(u => u.userId === id)?.employeeName ?? `#${id}`;

    const history = state.history;

    return (
        <div className="card">
            <div className="card-header">
                <h2>Previous Leave History</h2>
                <button className="btn btn-outline btn-sm" onClick={onRefresh} disabled={loading}>
                    {loading ? "Loading..." : "Refresh"}
                </button>
            </div>

            {loading && history.length === 0 ? (
                <p className="empty">Loading leave history...</p>
            ) : history.length === 0 ? (
                <p className="empty">No approved or rejected leaves yet.</p>
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
                                <th>Action Date</th>
                                <th>Admin Remark</th>
                            </tr>
                        </thead>
                        <tbody>
                            {history.map(leave => (
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
                                    <td>{formatDate(leave.actionDate)}</td>
                                    <td>{leave.adminRemark || <span className="muted">-</span>}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
}

export default PreviousHistory;
