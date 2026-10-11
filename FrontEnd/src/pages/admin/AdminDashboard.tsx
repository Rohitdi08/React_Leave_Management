import { useEffect, useState } from "react";
import { getEmployees } from "../../api/employeeApi";
import { errorMessage } from "../../api/http";
import { getPendingLeaves } from "../../api/leaveApi";
import StatCard from "../../components/StatCard";
import Tabs from "../../components/Tabs";
import { useApp } from "../../store/AppContext";
import EmployeeList from "./EmployeeList";
import LeaveRequests from "./LeaveRequests";

type AdminTab = "leaves" | "employees";

function AdminDashboard() {
    const { state, dispatch } = useApp();
    const [tab, setTab] = useState<AdminTab>("leaves");
    const [loading, setLoading] = useState(true);
    const [loadError, setLoadError] = useState("");
    const [reloadKey, setReloadKey] = useState(0);

    /* GET /api/employee (EmployeeLeave) + GET /api/leave/pending (LeaveSer), in parallel. */
    useEffect(() => {
        let ignore = false;
        Promise.all([getEmployees(), getPendingLeaves()])
            .then(([users, leaves]) => {
                if (ignore) return;
                dispatch({ type: "SET_USERS", users });
                dispatch({ type: "SET_LEAVES", leaves });
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
                    { key: "employees", label: "Employees" }
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

            {tab === "leaves"
                ? <LeaveRequests loading={loading} onRefresh={reload} />
                : <EmployeeList employees={employees} loading={loading} />}
        </div>
    );
}

export default AdminDashboard;
