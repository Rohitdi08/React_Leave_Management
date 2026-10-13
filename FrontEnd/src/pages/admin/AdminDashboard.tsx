import { useEffect, useState } from "react";
import { getEmployees } from "../../api/employeeApi";
import { errorMessage } from "../../api/http";
import { getPendingLeaves, getPreviousHistory } from "../../api/leaveApi";
import StatCard from "../../components/StatCard";
import Tabs from "../../components/Tabs";
import { useApp } from "../../store/AppContext";
import EmployeeList from "./EmployeeList";
import LeaveRequests from "./LeaveRequests";
import PreviousHistory from "./PreviousHistory";

type AdminTab = "leaves" | "employees" | "history";

function AdminDashboard() {
    const { state, dispatch } = useApp();
    const [tab, setTab] = useState<AdminTab>("leaves");
    const [loading, setLoading] = useState(true);
    const [loadError, setLoadError] = useState("");
    const [reloadKey, setReloadKey] = useState(0);

    /* GET /api/employee (EmployeeLeave) + GET /api/leave/pending and /api/leave/history (LeaveSer), in parallel. */
    useEffect(() => {
        let ignore = false;
        Promise.all([getEmployees(), getPendingLeaves(), getPreviousHistory()])
            .then(([users, leaves, history]) => {
                if (ignore) return;
                dispatch({ type: "SET_USERS", users });
                dispatch({ type: "SET_LEAVES", leaves });
                dispatch({ type: "SET_HISTORY", history });
            })
            .catch((err: unknown) => {
                if (!ignore) setLoadError(errorMessage(err));
            })
            .finally(() => {
                if (!ignore) setLoading(false);
            });
        return () => {
            ignore = true;
        };
    }, [dispatch, reloadKey]);

    const reload = () => {
        setLoading(true);
        setLoadError("");
        setReloadKey(key => key + 1);
    };

    const employees = state.users.filter(u => u.role === "Employee");
    const activeCount = employees.filter(e => e.isActive).length;
    const pendingCount = state.leaves.filter(l => l.status === "Pending").length;

    return (
        <div className="page">
            <div className="page-title">
                <h1>Admin Dashboard</h1>
                <p className="muted">Review pending leave requests and registered employees.</p>
            </div>

            <div className="stats">
                <StatCard label="Employees" value={employees.length} />
                <StatCard label="Active" value={activeCount} tone="approved" />
                <StatCard label="Inactive" value={employees.length - activeCount} tone="rejected" />
                <StatCard label="Pending Requests" value={pendingCount} tone="pending" />
            </div>

            <Tabs
                tabs={[
                    { key: "leaves", label: "Leave Requests" },
                    { key: "employees", label: "Employees" },
                    { key: "history", label: "Previous History" }
                ]}
                active={tab}
                onChange={setTab}
            />

            {loadError && (
                <div className="alert alert-error">
                    {loadError}{" "}
                    <button type="button" className="link-button" onClick={reload}>
                        Try again
                    </button>
                </div>
            )}

            {tab === "leaves" && <LeaveRequests loading={loading} onRefresh={reload} />}
            {tab === "employees" && <EmployeeList employees={employees} loading={loading} />}
            {tab === "history" && <PreviousHistory loading={loading} onRefresh={reload} />}
        </div>
    );
}

export default AdminDashboard;
