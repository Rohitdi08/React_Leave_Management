import { logout } from "../api/authApi";
import { useApp } from "../store/AppContext";

function Header() {
    const { state, dispatch } = useApp();
    const user = state.currentUser;

    return (
        <header className="header">
            <div className="brand">Leave Management</div>

            {user && (
                <div className="header-user">
                    <div className="header-user-info">
                        <strong>{user.employeeName}</strong>
                        <span>{user.role}</span>
                    </div>
                    <button
                        className="btn btn-outline"
                        onClick={() => {
                            logout();
                            dispatch({ type: "LOGOUT" });
                        }}
                    >
                        Logout
                    </button>
                </div>
            )}
        </header>
    );
}

export default Header;
