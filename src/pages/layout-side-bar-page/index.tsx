import React, {useState} from "react";
import {useDispatch, useSelector} from "react-redux";
import {changeRoute} from "../../store/currentPage/actions";
import {SideBar} from "../../components/side-bar";
import {Organizations} from "../organizations";
import {JupyterFrame} from "../../components/jupyter-frame";
import {SIDE_BAR_ITEMS} from "../../contstans/constans";
import "./styles/layout-side-bar-page.scss"
import {useHistory, useLocation} from 'react-router-dom'

export const LayoutSideBarPage: React.FunctionComponent = (props) => {
    const [currentPage, setCurrentPage] = useState<string>(window.location.pathname.substring(1))
    const history = useHistory()
    const dispatch = useDispatch();

    const changeRoutePath = (route: string) => {
        dispatch(changeRoute(route))
        setCurrentPage(route)
        history.push('/')
        history.push('/' + route)
    }
    return (
        <div className="layout-page">
            <div className="layout-page__side-bar-container">
                <SideBar
                    items={SIDE_BAR_ITEMS}
                    onSwitch={(value) => changeRoutePath(value)}
                />
            </div>
            <div className="layout-page__content-container">
                {(currentPage === 'research/my-files' || currentPage === 'coherence') && (<JupyterFrame/>)}
            </div>
        </div>
    )
}
