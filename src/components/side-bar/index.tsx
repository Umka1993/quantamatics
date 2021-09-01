import React from "react";
import "./styles/side-bar.scss"
const classNames = require('classnames');

import {SideBarItem} from "./service/side-bar-service";


interface ISideBar {
    items: Array<SideBarItem>
}

export const SideBar: React.FunctionComponent<ISideBar> = (props) => {
    const itemsList = props.items.map((item) => {
        const itemClasses: any = classNames({
            'side-bar__item': true,
            'side-bar__item_active': item.active
        })
        return (
            <div className={itemClasses}>
                <img src={item.image} className={"side-bar__item-img"}/>
                <div className="side-bar__item-name">
                    {item.name}
                </div>
            </div>
        )
    })
    return(
        <div className="side-bar">
            {itemsList}
        </div>
    )
}