import React from "react";
import { useDispatch } from "react-redux";
import { changeRoute } from "../../store/currentPage/actions";
import { SideBar } from "../../components/side-bar";
import { Organizations } from "../organizations";
import { AddUserPage } from "../add-user-page";
import { JupyterFrame } from "../../components/jupyter-frame";
import { SIDE_BAR_ITEMS } from "../../contstans/constans";
import "./styles/layout-side-bar-page.scss"
import { useHistory, Switch, Route, Redirect } from 'react-router-dom'
import { EditOrganization } from "../../components/edit-organization/edit-organization";
import { CreateOrganization } from "../../components/create-organization";

export const LayoutSideBarPage: React.FunctionComponent = (props) => {

    const history = useHistory()
    const dispatch = useDispatch();

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
                <Switch>
                    <Route exact path='/'>
                        <Redirect push to='/research/my-files' />
                    </Route>

                    <Route path='/add-user' component={AddUserPage} />

                    <Route path='/research/my-files'>
                        <JupyterFrame type='files' />
                    </Route>

                    <Route path='/coherence'>
                        <JupyterFrame type='coherence' />
                    </Route>

                    <Route path='/apps/organizations/list' component={Organizations} />
                    <Route path='/apps/organizations/new-organization' component={CreateOrganization} />
                    <Route path='/apps/organizations/:id' component={EditOrganization} />
                </Switch>
            </div>
        </div>
    )
}
