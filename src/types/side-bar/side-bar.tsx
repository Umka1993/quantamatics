import React from "react";

export type ReactSVGComponent = React.FunctionComponent<
  React.SVGAttributes<SVGElement>
>

export interface SideBarItem {
    image: ReactSVGComponent,
    name: string,
    active: boolean
    subItems?: SideBarSubItem[]
    route?: string,
    pathToActivate?: string
}

export interface SideBarSubItem {
    image: ReactSVGComponent,
    name: string,
    active: boolean
    route?: string
}
