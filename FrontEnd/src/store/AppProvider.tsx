import { useEffect, useReducer, type ReactNode } from "react";
import { setSessionExpiredHandler } from "../api/http";
import { getSession } from "../api/session";
import { AppContext } from "./AppContext";
import { appReducer } from "./appReducer";

function AppProvider({ children }: { children: ReactNode }) {
    /* Restore the logged-in user saved by a previous login, so a refresh keeps the session. */
    const [state, dispatch] = useReducer(appReducer, null, () => ({
        currentUser: getSession()?.user ?? null,
        users: [],
        leaves: []
    }));

    /* When a token can no longer be refreshed, http.ts clears it and we return to the login page. */
    useEffect(() => {
        setSessionExpiredHandler(() => dispatch({ type: "LOGOUT" }));
        return () => setSessionExpiredHandler(() => {});
    }, []);

    return (
        <AppContext value={{ state, dispatch }}>
            {children}
        </AppContext>
    );
}

export default AppProvider;
