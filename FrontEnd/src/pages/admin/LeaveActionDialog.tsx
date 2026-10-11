import { useState } from "react";
import { errorMessage } from "../../api/http";
import type { Leave } from "../../types";
import { dayCount, formatDate } from "../../utils/date";

type LeaveActionDialogProps = {
    leave: Leave;
    employeeName: string;
    action: "Approve" | "Reject";
    onConfirm: (remark: string) => Promise<void>;
    onClose: () => void;
};

function LeaveActionDialog({ leave, employeeName, action, onConfirm, onClose }: LeaveActionDialogProps) {
    const [remark, setRemark] = useState("");
    const [error, setError] = useState("");
    const [submitting, setSubmitting] = useState(false);

    const handleConfirm = async () => {
        /* A reason is required when rejecting so the employee knows why (the API enforces it too). */
        if (action === "Reject" && !remark.trim()) {
            setError("Please enter a remark for rejection.");
            return;
        }

        setError("");
        setSubmitting(true);
        try {
            await onConfirm(remark.trim());
        } catch (err) {
            /* e.g. 400 "Leave is already Approved." when another admin acted first. */
            setError(errorMessage(err));
            setSubmitting(false);
        }
    };

    const close = () => {
        if (!submitting) onClose();
    };

    return (
        <div className="overlay" onClick={close}>
            <div
                className="dialog card"
                role="dialog"
                aria-modal="true"
                aria-labelledby="dialog-title"
                onClick={e => e.stopPropagation()}
            >
                <h2 id="dialog-title">{action} Leave</h2>

                <dl className="details">
                    <dt>Employee</dt>
                    <dd>{employeeName}</dd>
                    <dt>Leave Type</dt>
                    <dd>{leave.leaveType}</dd>
                    <dt>Dates</dt>
                    <dd>
                        {formatDate(leave.fromDate)} to {formatDate(leave.toDate)} ({dayCount(leave.fromDate, leave.toDate)} days)
                    </dd>
                    <dt>Reason</dt>
                    <dd>{leave.reason}</dd>
                </dl>

                <div className="field">
                    <label htmlFor="remark">
                        Admin Remark {action === "Approve" && <span className="muted">(optional)</span>}
                    </label>
                    <textarea
                        id="remark"
                        rows={3}
                        value={remark}
                        onChange={e => setRemark(e.target.value)}
                        autoFocus
                    />
                    {error && <span className="field-error">{error}</span>}
                </div>

                <div className="dialog-actions">
                    <button className="btn btn-outline" onClick={close} disabled={submitting}>
                        Cancel
                    </button>
                    <button
                        className={`btn ${action === "Approve" ? "btn-success" : "btn-danger"}`}
                        onClick={handleConfirm}
                        disabled={submitting}
                    >
                        {submitting ? "Saving..." : action}
                    </button>
                </div>
            </div>
        </div>
    );
}

export default LeaveActionDialog;
