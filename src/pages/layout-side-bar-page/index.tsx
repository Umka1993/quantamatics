import React, {useState} from "react";
import {SideBar} from "../../components/side-bar";
import {Organizations} from "../organizations";
import {SIDE_BAR_ITEMS} from "../../contstans/constans";
import "./styles/layout-side-bar-page.scss"
import { useLocation } from 'react-router-dom'

export const LayoutSideBarPage: React.FunctionComponent = (props) => {
    const [currentPage, setCurrentPage] = useState<string>('')

    const currentRoute = useLocation().pathname

    console.log(currentRoute)

    return (
        <div className="layout-page">
            <div className="layout-page__side-bar-container">
                <SideBar
                    items={SIDE_BAR_ITEMS}
                    onSwitch={(value) => setCurrentPage(value)}
                />
            </div>
            <div className="layout-page__content-container">
                    <Organizations currentPage={currentRoute}/>
            </div>
        </div>
    )
}
