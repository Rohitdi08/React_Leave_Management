import { useState, type SubmitEvent } from "react";
import { login } from "../../api/authApi";
import { errorMessage } from "../../api/http";
import { useApp } from "../../store/AppContext";

type LoginPageProps = {
    onShowRegister: () => void;
    message: string;
};

function LoginPage({ onShowRegister, message }: LoginPageProps) {
    const { dispatch } = useApp();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [submitting, setSubmitting] = useState(false);

    const handleSubmit = async (event: SubmitEvent<HTMLFormElement>) => {
        event.preventDefault();

        if (!email.trim() || !password) {
            setError("Please enter email and password.");
            return;
        }

        setError("");
        setSubmitting(true);
        try {
            /* POST /api/Auth/Login, then GET /api/employee/{id} for the profile. */
            const user = await login(email.trim(), password);
            dispatch({ type: "LOGIN", user });
        } catch (err) {
            setError(errorMessage(err));
            setSubmitting(false);
        }
    };

    return (
        <div className="auth-card card">
            <h1>Login</h1>
            <p className="muted">Sign in as an employee or admin.</p>

            {message && <div className="alert alert-success">{message}</div>}
            {error && <div className="alert alert-error">{error}</div>}

            <form onSubmit={handleSubmit} noValidate>
                <div className="field">
                    <label htmlFor="login-email">Email</label>
                    <input
                        id="login-email"
                        type="email"
                        value={email}
                        onChange={e => setEmail(e.target.value)}
                        placeholder="you@company.com"
                        autoComplete="username"
                    />
                </div>

                <div className="field">
                    <label htmlFor="login-password">Password</label>
                    <input
                        id="login-password"
                        type="password"
                        value={password}
                        onChange={e => setPassword(e.target.value)}
                        placeholder="Enter password"
                        autoComplete="current-password"
                    />
                </div>

                <button type="submit" className="btn btn-primary btn-block" disabled={submitting}>
                    {submitting ? "Signing in..." : "Login"}
                </button>
            </form>

            <p className="auth-switch">
                New employee?{" "}
                <button type="button" className="link-button" onClick={onShowRegister}>
                    Register here
                </button>
            </p>
        </div>
    );
}

export default LoginPage;
