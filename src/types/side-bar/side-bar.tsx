import React from "react";

export type ReactSVGComponent = React.FunctionComponent<
  React.SVGAttributes<SVGElement>
>

export interface SideBarItem {
    image: ReactSVGComponent,
    name: string,
    active: Boolean
}