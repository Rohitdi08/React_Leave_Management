import { useState } from "react";
import Header from "./components/Header";
import AdminDashboard from "./pages/admin/AdminDashboard";
import LoginPage from "./pages/auth/LoginPage";
import RegisterPage from "./pages/auth/RegisterPage";
import EmployeeDashboard from "./pages/employee/EmployeeDashboard";
import { useApp } from "./store/AppContext";

function App() {
    const { state } = useApp();
    const [authView, setAuthView] = useState<"login" | "register">("login");
    const [loginMessage, setLoginMessage] = useState("");

    const renderContent = () => {
        /* Role-based routing: Employee -> Employee Dashboard, Admin -> Admin Dashboard. */
        if (state.currentUser) {
            return state.currentUser.role === "Admin"
                ? <AdminDashboard />
                : <EmployeeDashboard />;
        }

        if (authView === "register") {
            return (
                <RegisterPage
                    onShowLogin={() => setAuthView("login")}
                    onRegistered={() => {
                        setLoginMessage("Registration successful. Please log in.");
                        setAuthView("login");
                    }}
                />
            );
        }

        return (
            <LoginPage
                message={loginMessage}
                onShowRegister={() => {
                    setLoginMessage("");
                    setAuthView("register");
                }}
            />
        );
    };

    return (
        <div className="app">
            <Header />
            <main className={state.currentUser ? "main" : "main main-center"}>
                {renderContent()}
            </main>
        </div>
    );
}

export default App;
