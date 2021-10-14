import {Organization} from "../../types/organization/types";

export interface OrganizationState {
    all: Organization[]
}

const initialState = {
    all: []
}

type Action = { type: "ADD_ORGS", payload: Organization[] }

export const OrganizationReducer = (state: OrganizationState = initialState, action: Action) => {
    switch (action.type) {
        case "ADD_ORGS":
            return {
                ...state, all: action.payload
            }
        default:
            return state


    }
}
