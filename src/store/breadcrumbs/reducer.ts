import { NavActions, NavActionsType } from "./actions";

export interface LinkData {
    text: string
    href?: string;
}

type BreadcrumbsState = Array<LinkData> | null;

export const breadcrumbsReducer = (state: BreadcrumbsState = null, action: NavActions) => {
    switch (action.type) {
        case NavActionsType.All:
            return action.payload
        // case NavActionsType.Last:
            
        //     state && (state as Array<LinkData>).splice(-1, 1, action.payload )
            // return state
        default:
            return state

    }
}
