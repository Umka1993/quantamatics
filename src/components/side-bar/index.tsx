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
            <div className="side-bar__items">
                {itemsList}
            </div>
            <div className="side-bar__footer">
                © Copyright 2021 Facteus. <br/>
                All rights reserved. <a href="https://www.facteus.com/privacy-policy/">Privacy Policy</a>
            </div>
        </div>
    )
}
