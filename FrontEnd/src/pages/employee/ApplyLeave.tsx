import { useState, type SubmitEvent } from "react";
import { errorMessage } from "../../api/http";
import { applyLeave } from "../../api/leaveApi";
import { LEAVE_TYPES } from "../../data/lookups";
import type { Leave } from "../../types";
import { dayCount, formatDate, today } from "../../utils/date";

type ApplyLeaveProps = {
    myLeaves: Leave[];
    onApplied: () => void;
};

function ApplyLeave({ myLeaves, onApplied }: ApplyLeaveProps) {
    const [leaveType, setLeaveType] = useState("");
    const [fromDate, setFromDate] = useState("");
    const [toDate, setToDate] = useState("");
    const [reason, setReason] = useState("");
    const [error, setError] = useState("");
    const [submitting, setSubmitting] = useState(false);

    const minDate = today();

    /* Same rules as LeaveSer checks, so most mistakes are caught before the request. */
    const validate = (): string => {
        if (!leaveType || !fromDate || !toDate || !reason.trim()) {
            return "Please fill in all fields.";
        }
        if (fromDate < minDate) {
            return "From Date cannot be in the past.";
        }
        if (toDate < fromDate) {
            return "To Date cannot be before From Date.";
        }
        if (reason.trim().length < 5) {
            return "Reason must be at least 5 characters.";
        }

        /* Block overlap with the employee's own Pending/Approved leave. */
        const overlap = myLeaves.find(
            l => l.status !== "Rejected" && fromDate <= l.toDate && toDate >= l.fromDate
        );
        if (overlap) {
            return `These dates overlap with your ${overlap.status.toLowerCase()} leave (${formatDate(overlap.fromDate)} to ${formatDate(overlap.toDate)}).`;
        }

        return "";
    };

    const handleSubmit = async (event: SubmitEvent<HTMLFormElement>) => {
        event.preventDefault();

        const message = validate();
        setError(message);
        if (message) {
            return;
        }

        setSubmitting(true);
        try {
            /* POST /api/leave/apply - the employee id is taken from the JWT by the API. */
            await applyLeave({ leaveType, fromDate, toDate, reason: reason.trim() });
            onApplied();
        } catch (err) {
            setError(errorMessage(err));
            setSubmitting(false);
        }
    };

    const days = fromDate && toDate && toDate >= fromDate ? dayCount(fromDate, toDate) : 0;

    return (
        <div className="card">
            <h2>Apply Leave</h2>
            <p className="muted">Your request will be sent to the admin with status Pending.</p>

            {error && <div className="alert alert-error">{error}</div>}

            <form onSubmit={handleSubmit} noValidate className="form-narrow">
                <div className="field">
                    <label htmlFor="leave-type">Leave Type</label>
                    <select
                        id="leave-type"
                        value={leaveType}
                        onChange={e => setLeaveType(e.target.value)}
                    >
                        <option value="">Select leave type</option>
                        {LEAVE_TYPES.map(type => (
                            <option key={type} value={type}>{type}</option>
                        ))}
                    </select>
                </div>

                <div className="field-row">
                    <div className="field">
                        <label htmlFor="from-date">From Date</label>
                        <input
                            id="from-date"
                            type="date"
                            min={minDate}
                            value={fromDate}
                            onChange={e => setFromDate(e.target.value)}
                        />
                    </div>

                    <div className="field">
                        <label htmlFor="to-date">To Date</label>
                        <input
                            id="to-date"
                            type="date"
                            min={fromDate || minDate}
                            value={toDate}
                            onChange={e => setToDate(e.target.value)}
                        />
                    </div>
                </div>

                {days > 0 && (
                    <p className="muted">Total: {days} day{days > 1 ? "s" : ""}</p>
                )}

                <div className="field">
                    <label htmlFor="reason">Reason</label>
                    <textarea
                        id="reason"
                        rows={3}
                        maxLength={500}
                        value={reason}
                        onChange={e => setReason(e.target.value)}
                        placeholder="Reason for leave"
                    />
                </div>

                <button type="submit" className="btn btn-primary" disabled={submitting}>
                    {submitting ? "Submitting..." : "Submit Leave"}
                </button>
            </form>
        </div>
    );
}

export default ApplyLeave;
