import { createContext, useContext, type ActionDispatch } from "react";
import type { AppAction, AppState } from "./appReducer";

type AppContextValue = {
    state: AppState;
    dispatch: ActionDispatch<[action: AppAction]>;
};

export const AppContext = createContext<AppContextValue | null>(null);

export function useApp(): AppContextValue {
    const context = useContext(AppContext);
    if (!context) {
        throw new Error("useApp must be used inside <AppProvider>");
    }
    return context;
}
