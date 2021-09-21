interface User {
    username: string
}

export interface UserState {
    user: User
}

const initialState = {
    user: {
        username: ''
    }
}

type Action = { type: "LOGIN" | "LOGOUT", payload: User }

export const userReducer = (state: UserState = initialState, action: Action) => {
    switch (action.type) {
        case "LOGIN":
            return {
                ...state, user: action.payload
            }
        case "LOGOUT":
            return {
                ...state, user: action.payload
            }
        default:
            return state


    }
}
