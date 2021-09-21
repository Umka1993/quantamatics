interface CurrentPage {
    pageName: string
}

export interface CurrentPageState {
    currentPage: CurrentPage
}

const initialState = {
    currentPage: {
        pageName: 'My Files'
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
