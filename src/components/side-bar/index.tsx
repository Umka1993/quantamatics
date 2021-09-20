import React from "react";
import "./styles/side-bar.scss"

import {SideBarItem} from "../../types/side-bar/side-bar";
import {BarItem} from "./SubItem";


interface ISideBar {
    items: Array<SideBarItem>
    onSwitch: (name: string) => void
}

export const SideBar: React.FunctionComponent<ISideBar> = (props) => {
    const itemsList = props.items.map((item, index) => {
        return <BarItem key={index} item={item} onSwitch={props.onSwitch} />
    })
    return(
        <div className="side-bar">
            {itemsList}
        </div>
    )
}
