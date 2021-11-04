import React from "react";
import { useDispatch } from "react-redux";
import { changeRoute } from "../../store/currentPage/actions";
import { SideBar } from "../../components/side-bar";
import { Organizations } from "../organizations";
import { JupyterFrame } from "../../components/jupyter-frame";
import { SIDE_BAR_ITEMS } from "../../contstans/constans";
import "./styles/layout-side-bar-page.scss"
import { useHistory, Switch, Route, Redirect } from 'react-router-dom'
import { EditOrganization } from "../../components/edit-organization/edit-organization";
import { CreateOrganizationForm } from "../../components/form";

export const LayoutSideBarPage: React.FunctionComponent = (props) => {

    const history = useHistory()
    const dispatch = useDispatch();

    const changeRoutePath = (route: string) => {
        dispatch(changeRoute(route))
        history.push('/')
        history.push('/' + route)
    }
    return (
        <div className="layout-page app__main">
            <SideBar
                items={SIDE_BAR_ITEMS}
                onSwitch={(value) => changeRoutePath(value)}
            />

            <div className="layout-page__scroll">
                <div className="layout-page__content-container">
                    <Switch>
                        <Route exact path='/'>
                            <Redirect push to='/research/my-files' />
                        </Route>

                        {/* <Route path='/add-user' component={AddUserPage} /> */}

                        <Route path='/research/my-files'>
                            <JupyterFrame type='files' />
                        </Route>

                        <Route path='/coherence'>
                            <JupyterFrame type='coherence' />
                        </Route>

                        <Route path='/apps/organizations/list' component={Organizations} />
                        <Route path='/apps/organizations/new-organization' component={CreateOrganizationForm} />
                        <Route path='/apps/organizations/:id' component={EditOrganization} />
                    </Switch>
                </div>
            </div>
        </div>
    )
}
