interface CurrentPage {
    pageName: string
}

export interface CurrentPageState {
    currentPage: CurrentPage
}

const initialState = {
    currentPage: {
        pageName: window.location.pathname.substring(1).includes('apps/organizations/dudka-agency') ?
            'apps/organizations/dudka-agency' : window.location.pathname.substring(1)
    }
}

type Action = { type: "CHANGE_ROUTE", payload: CurrentPage }

export const currentPageReducer = (state: CurrentPageState = initialState, action: Action) => {
    switch (action.type) {
        case "CHANGE_ROUTE":
            return {
                ...state, currentPage: action.payload
            }
        default:
            return state


    }
}
