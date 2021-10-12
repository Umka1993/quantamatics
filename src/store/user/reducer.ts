interface User {
    id: number,
    email: string,
    firstName: string,
    lastName: string,
    companyName: string,
    companyRole: string,
    location: string,
    subscriptionType:string,
    subscriptionEndDate: string,
    reportPanel: null,
    expirationDate: string,
    avatar: string,
    //"userRoles": []
}

export interface UserState {
    user: User
}

const initialState = {
    user: {
        id: 0,
        email: '',
        lastName: '',
        firstName: localStorage.getItem('firstName') || '',
        companyName: '',
        companyRole: '',
        location: '',
        subscriptionType: '',
        subscriptionEndDate: '',
        reportPanel: null,
        expirationDate: '',
        avatar: ''

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
