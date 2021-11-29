import { LinkData } from "./reducer";

export const enum NavActionsType {
    All = 'CHANGE_ALL',
    Last = 'REWRITE_LAST'
}

export const changeAllNavLinks = (links: Array<LinkData> | null) => ({
    type: NavActionsType.All,
    payload: links
});

// export const changeLastLink = (link: LinkData) => ({
//     type: NavActionsType.Last,
//     payload: link,
// });

export type NavActions =
    | ReturnType<typeof changeAllNavLinks>
    // | ReturnType<typeof changeLastLink>;
