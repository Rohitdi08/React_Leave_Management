import { useState, type SubmitEvent } from "react";
import { register } from "../../api/authApi";
import { ApiError, errorMessage } from "../../api/http";
import { DEPARTMENTS, ROLE_IDS } from "../../data/lookups";

type RegisterPageProps = {
    onShowLogin: () => void;
    onRegistered: () => void;
};

type FormValues = {
    employeeName: string;
    email: string;
    mobileNo: string;
    department: string;
    password: string;
    confirmPassword: string;
};

type FormErrors = Partial<Record<keyof FormValues, string>>;

const emptyForm: FormValues = {
    employeeName: "",
    email: "",
    mobileNo: "",
    department: "",
    password: "",
    confirmPassword: ""
};

function RegisterPage({ onShowLogin, onRegistered }: RegisterPageProps) {
    const [values, setValues] = useState<FormValues>(emptyForm);
    const [errors, setErrors] = useState<FormErrors>({});
    const [serverError, setServerError] = useState("");
    const [submitting, setSubmitting] = useState(false);

    const setField = (field: keyof FormValues, value: string) => {
        setValues(prev => ({ ...prev, [field]: value }));
    };

    const validate = (): FormErrors => {
        const result: FormErrors = {};
        const email = values.email.trim().toLowerCase();

        if (!values.employeeName.trim()) {
            result.employeeName = "Employee name is required.";
        }

        if (!email) {
            result.email = "Email is required.";
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            result.email = "Enter a valid email address.";
        }
        /* A duplicate email is reported by the API (409). */

        if (!values.mobileNo.trim()) {
            result.mobileNo = "Mobile number is required.";
        } else if (!/^[6-9]\d{9}$/.test(values.mobileNo.trim())) {
            result.mobileNo = "Enter a valid 10-digit mobile number.";
        }

        if (!values.department) {
            result.department = "Please select a department.";
        }

        if (!values.password) {
            result.password = "Password is required.";
        } else if (values.password.length < 6) {
            result.password = "Password must be at least 6 characters.";
        }

        if (!values.confirmPassword) {
            result.confirmPassword = "Please confirm your password.";
        } else if (values.password !== values.confirmPassword) {
            result.confirmPassword = "Passwords do not match.";
        }

        return result;
    };

    const handleSubmit = async (event: SubmitEvent<HTMLFormElement>) => {
        event.preventDefault();

        const validationErrors = validate();
        setErrors(validationErrors);
        setServerError("");
        if (Object.keys(validationErrors).length > 0) {
            return;
        }

        setSubmitting(true);
        try {
            /* POST /api/Auth/Register - new accounts are always active Employees. */
            await register({
                employeeName: values.employeeName.trim(),
                email: values.email.trim().toLowerCase(),
                mobileNo: values.mobileNo.trim(),
                department: Number(values.department),
                password: values.password,
                role: ROLE_IDS.Employee,
                isActive: 1
            });
            onRegistered();
        } catch (err) {
            /* Show model-validation messages under their fields, anything else (e.g. 409 duplicate email) on top. */
            if (err instanceof ApiError && Object.keys(err.fieldErrors).length > 0) {
                setErrors(err.fieldErrors as FormErrors);
            }
            setServerError(errorMessage(err));
            setSubmitting(false);
        }
    };

    return (
        <div className="auth-card card">
            <h1>Employee Registration</h1>
            <p className="muted">Create your account to apply for leave.</p>

            {serverError && <div className="alert alert-error">{serverError}</div>}

            <form onSubmit={handleSubmit} noValidate>
                <div className="field">
                    <label htmlFor="reg-name">Employee Name</label>
                    <input
                        id="reg-name"
                        value={values.employeeName}
                        onChange={e => setField("employeeName", e.target.value)}
                        placeholder="Full name"
                    />
                    {errors.employeeName && <span className="field-error">{errors.employeeName}</span>}
                </div>

                <div className="field">
                    <label htmlFor="reg-email">Email</label>
                    <input
                        id="reg-email"
                        type="email"
                        value={values.email}
                        onChange={e => setField("email", e.target.value)}
                        placeholder="you@company.com"
                    />
                    {errors.email && <span className="field-error">{errors.email}</span>}
                </div>

                <div className="field-row">
                    <div className="field">
                        <label htmlFor="reg-mobile">Mobile Number</label>
                        <input
                            id="reg-mobile"
                            type="tel"
                            inputMode="numeric"
                            maxLength={10}
                            value={values.mobileNo}
                            onChange={e => setField("mobileNo", e.target.value.replace(/\D/g, ""))}
                            placeholder="10-digit number"
                        />
                        {errors.mobileNo && <span className="field-error">{errors.mobileNo}</span>}
                    </div>

                    <div className="field">
                        <label htmlFor="reg-dept">Department</label>
                        <select
                            id="reg-dept"
                            value={values.department}
                            onChange={e => setField("department", e.target.value)}
                        >
                            <option value="">Select department</option>
                            {DEPARTMENTS.map(dept => (
                                <option key={dept.id} value={dept.id}>{dept.name}</option>
                            ))}
                        </select>
                        {errors.department && <span className="field-error">{errors.department}</span>}
                    </div>
                </div>

                <div className="field-row">
                    <div className="field">
                        <label htmlFor="reg-password">Password</label>
                        <input
                            id="reg-password"
                            type="password"
                            value={values.password}
                            onChange={e => setField("password", e.target.value)}
                            autoComplete="new-password"
                        />
                        {errors.password && <span className="field-error">{errors.password}</span>}
                    </div>

                    <div className="field">
                        <label htmlFor="reg-confirm">Confirm Password</label>
                        <input
                            id="reg-confirm"
                            type="password"
                            value={values.confirmPassword}
                            onChange={e => setField("confirmPassword", e.target.value)}
                            autoComplete="new-password"
                        />
                        {errors.confirmPassword && <span className="field-error">{errors.confirmPassword}</span>}
                    </div>
                </div>

                <button type="submit" className="btn btn-primary btn-block" disabled={submitting}>
                    {submitting ? "Registering..." : "Register"}
                </button>
            </form>

            <p className="auth-switch">
                Already registered?{" "}
                <button type="button" className="link-button" onClick={onShowLogin}>
                    Login
                </button>
            </p>
        </div>
    );
}

export default RegisterPage;
