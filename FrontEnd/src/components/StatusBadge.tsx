import type { LeaveStatus } from "../types";

function StatusBadge({ status }: { status: LeaveStatus | "Active" | "Inactive" }) {
    return (
        <span className={`badge badge-${status.toLowerCase()}`}>
            {status}
        </span>
    );
}

export default StatusBadge;
