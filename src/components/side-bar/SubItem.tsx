import React, { useState } from "react";
import "./styles/side-bar.scss"
const classNames = require('classnames');

import toggleArrow from "./assets/toggle-arrow.svg";
import { SideBarItem, SideBarSubItem } from "../../types/side-bar/side-bar";
import { SVG } from "../SVG";
import { useLocation } from "react-router";

interface ISideBar {
    classNames?: string
    item: SideBarItem
    onSwitch: (name: string) => void
}

export const BarItem: React.FunctionComponent<ISideBar> = (props) => {
    const { item } = props;
    const { pathname } = useLocation();

    const itemActive = item.pathToActivate ? 
                pathname.includes(String(item.pathToActivate)) : 
                pathname.includes(String(item.route));

    const subItemActive = !!item.subItems && item.subItems.filter(obj => obj.route === window.location.pathname.substring(1))[0]
    const [opened, setOpened] = useState<boolean>(!!subItemActive)
    const itemClasses: any = classNames({
        'side-bar__item': true,
        'side-bar__item_active': itemActive,
        'side-bar__item_opened': opened,
    }, props.classNames)

    const subItemsList = !!item.subItems && item.subItems.map((subItem: SideBarSubItem, index) => {
        const subItemClasses: any = classNames({
            'side-bar__item side-bar__item-sub': true,
            'side-bar__item-sub-stroke': subItem.active,
        })

        return <BarItem key={index} classNames={subItemClasses} item={subItem} onSwitch={props.onSwitch} />
    })

    return (
        <div className='side-bar__item-wrapper'>
            <div className={itemClasses} key={item.name} onClick={() => !!item.subItems ? setOpened(!opened) : props.onSwitch(item.route ? item.route : '/')}>
                <SVG icon={item.image} className={"side-bar__item-img"} />
                <div className="side-bar__item-name">
                    {item.name}
                </div>
                {!!item.subItems && <SVG icon={toggleArrow} className={"side-bar__item-toggle-img"} />}
            </div>
            <div className={classNames('sub-items-list', { opened: opened })}>
                {subItemsList}
            </div>

        </div>

    )
}
