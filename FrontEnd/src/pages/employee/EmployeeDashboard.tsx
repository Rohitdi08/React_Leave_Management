import { useEffect, useState } from "react";
import { errorMessage } from "../../api/http";
import { getMyLeaves } from "../../api/leaveApi";
import StatCard from "../../components/StatCard";
import Tabs from "../../components/Tabs";
import { useApp } from "../../store/AppContext";
import type { LeaveStatus } from "../../types";
import ApplyLeave from "./ApplyLeave";
import MyLeaves from "./MyLeaves";

type EmployeeTab = "my-leaves" | "apply";

function EmployeeDashboard() {
    const { state, dispatch } = useApp();
    const [tab, setTab] = useState<EmployeeTab>("my-leaves");
    const [message, setMessage] = useState("");
    const [loading, setLoading] = useState(true);
    const [loadError, setLoadError] = useState("");
    const [reloadKey, setReloadKey] = useState(0);

    const user = state.currentUser!;

    /* GET /api/leave/my-leaves on open, and again after a leave is applied. */
    useEffect(() => {
        let ignore = false;
        getMyLeaves()
            .then(leaves => {
                if (!ignore) dispatch({ type: "SET_LEAVES", leaves });
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

    /* Newest request first. */
    const myLeaves = [...state.leaves].sort((a, b) => b.leaveId - a.leaveId);

    const count = (status: LeaveStatus) => myLeaves.filter(l => l.status === status).length;

    const changeTab = (next: EmployeeTab) => {
        setMessage("");
        setTab(next);
    };

    return (
        <div className="page">
            <div className="page-title">
                <h1>Welcome, {user.employeeName}</h1>
                <p className="muted">Employee ID {user.userId} · {user.department}</p>
            </div>

            <div className="stats">
                <StatCard label="Total Requests" value={myLeaves.length} />
                <StatCard label="Pending" value={count("Pending")} tone="pending" />
                <StatCard label="Approved" value={count("Approved")} tone="approved" />
                <StatCard label="Rejected" value={count("Rejected")} tone="rejected" />
            </div>

            <Tabs
                tabs={[
                    { key: "my-leaves", label: "My Leaves" },
                    { key: "apply", label: "Apply Leave" }
                ]}
                active={tab}
                onChange={changeTab}
            />

            {message && <div className="alert alert-success">{message}</div>}
            {loadError && (
                <div className="alert alert-error">
                    {loadError}{" "}
                    <button type="button" className="link-button" onClick={reload}>
                        Try again
                    </button>
                </div>
            )}

            {tab === "apply" ? (
                <ApplyLeave
                    myLeaves={myLeaves}
                    onApplied={() => {
                        setTab("my-leaves");
                        setMessage("Leave request submitted. Status: Pending.");
                        reload();
                    }}
                />
            ) : (
                <MyLeaves leaves={myLeaves} loading={loading} />
            )}
        </div>
    );
}

export default EmployeeDashboard;
