import React, {useEffect, useState} from "react";
import {useDispatch, useSelector} from "react-redux";
import {changeRoute} from "../../store/currentPage/actions";
import {SideBar} from "../../components/side-bar";
import {Organizations} from "../organizations";
import {AddUserPage} from "../add-user-page";
import {JupyterFrame} from "../../components/jupyter-frame";
import {CoherenceFrame} from "../../components/coherence-frame";
import {SIDE_BAR_ITEMS} from "../../contstans/constans";
import "./styles/layout-side-bar-page.scss"
import {useHistory, useLocation} from 'react-router-dom'
import {EditOrganization} from "../../components/edit-organization/edit-organization";
import {CreateOrganization} from "../../components/create-organization";

export const LayoutSideBarPage: React.FunctionComponent = (props) => {
    const [currentPage, setCurrentPage] = useState<string>('')
    const history = useHistory()
    const dispatch = useDispatch();

    useEffect(()=> {
        if (window.location.pathname.substring(1) === '') {
            history.push('/research/my-files')
            dispatch(changeRoute('research/my-files'))
        }
        setCurrentPage(window.location.pathname.substring(1))
    }, [window.location.pathname])

    const changeRoutePath = (route: string) => {
        dispatch(changeRoute(route))
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
                {(currentPage === 'research/my-files' || currentPage === 'coherence') && (
                    <JupyterFrame type={currentPage === 'research/my-files' ? 'files' : 'coherence'} />
                )}
                {currentPage === 'add-user' && <AddUserPage />}
                {currentPage === 'apps/organizations/list' && <Organizations/>}
                {currentPage === 'apps/organizations/new-organization' && <CreateOrganization/>}
                {currentPage.includes('apps/organizations/dudka-agency') && <EditOrganization/>}
            </div>
        </div>
    )
}
