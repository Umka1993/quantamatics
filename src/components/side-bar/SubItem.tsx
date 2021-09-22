import React, {useState} from "react";
import "./styles/side-bar.scss"
const classNames = require('classnames');

import toggleArrow from "./assets/toggle-arrow.svg";
import {SideBarItem, SideBarSubItem} from "../../types/side-bar/side-bar";
import {SVG} from "../SVG";


interface ISideBar {
    classNames?: string
    item: SideBarItem
    onSwitch: (name: string) => void
}

export const BarItem: React.FunctionComponent<ISideBar> = (props) => {
    const {item} = props;
    const subItemActive = !!item.subItems && item.subItems.filter(obj => obj.active)[0]
    const [opened, setOpened] = useState<boolean>(!!subItemActive)
    const itemClasses: any = classNames({
        'side-bar__item': true,
        'side-bar__item_active': item.active ,
        'side-bar__item_opened': opened,
    }, props.classNames)

    const subItemsList = !!item.subItems && item.subItems.map((subItem: SideBarSubItem, index) => {
        const subItemClasses: any = classNames({
            'side-bar__item side-bar__item-sub': true,
            'side-bar__item_active-sub': subItem.active
        })

        return <BarItem key={index} classNames={subItemClasses} item={subItem} onSwitch={props.onSwitch} />
    })

    return (
        <div className='side-bar__item-wrapper'>
            <div className={itemClasses} key={item.name} onClick={() => !!item.subItems ? setOpened(!opened) : props.onSwitch(item.name)}>
                <SVG icon={item.image} className={"side-bar__item-img"}/>
                <div className="side-bar__item-name">
                    {item.name}
                </div>
                {!!item.subItems && <SVG icon={toggleArrow} className={"side-bar__item-toggle-img"}/>}
            </div>
            {opened && subItemsList}
        </div>

    )
}
