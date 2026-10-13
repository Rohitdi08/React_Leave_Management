import type { Leave, User } from "../types";

/*
 * Client-side copy of what the API returned. The API is the source of truth:
 * pages call src/api/* first, then dispatch the response here.
 */
export type AppState = {
    currentUser: User | null;
    users: User[]; // GET /api/employee (admin)
    leaves: Leave[]; // GET /api/leave/my-leaves (employee) or /api/leave/pending (admin)
    history: Leave[]; // GET /api/leave/history (admin)
};

export type AppAction =
    | { type: "LOGIN"; user: User } // after POST /api/Auth/Login + GET /api/employee/{id}
    | { type: "LOGOUT" }
    | { type: "SET_USERS"; users: User[] }
    | { type: "SET_LEAVES"; leaves: Leave[] }
    | { type: "SET_HISTORY"; history: Leave[] }
    | { type: "UPDATE_LEAVE"; leave: Leave }; // response of PUT /api/leave/approve|reject/{id}

export function appReducer(state: AppState, action: AppAction): AppState {
    switch (action.type) {
        /* Start every login/logout with empty lists so one user never sees another's data. */
        case "LOGIN":
            return { currentUser: action.user, users: [], leaves: [], history: [] };

        case "LOGOUT":
            return { currentUser: null, users: [], leaves: [], history: [] };

        case "SET_USERS":
            return { ...state, users: action.users };

        case "SET_LEAVES":
            return { ...state, leaves: action.leaves };

        case "SET_HISTORY":
            return { ...state, history: action.history };

        /* An approved/rejected leave also goes to the top of the admin's history. */
        case "UPDATE_LEAVE":
            return {
                ...state,
                leaves: state.leaves.map(leave =>
                    leave.leaveId === action.leave.leaveId ? action.leave : leave
                ),
                history: action.leave.status === "Pending"
                    ? state.history
                    : [action.leave, ...state.history.filter(l => l.leaveId !== action.leave.leaveId)]
            };

        default:
            return state;
    }
}
