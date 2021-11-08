import React, { useState, useRef, useEffect } from 'react';
import "./styles/header.scss"
import logoImg from "./assets/new-logo.svg"
import logoTextImg from "./assets/Quantamatics.svg"
import searchImg from "./assets/search.svg"
import ringImg from "./assets/ring.svg"
import avatar from "./assets/avatar.svg"
import arrowImg from "./assets/toggle-arrow.svg"
import profileImg from "./assets/profile.svg"
import settingsImg from "./assets/settings.svg"
import logoutImg from "./assets/logout.svg"
import SVG from '../SVG'
import { useDispatch, useSelector } from "react-redux";
import classNames from "classnames";
import { RootState } from "../../store";
import { useHistory } from "react-router-dom";
import { changeRoute } from "../../store/currentPage/actions";
import { EditPassword } from '../edit-modal/edit-password';
// import {EditProfile} from "../edit-profile";
import { IUser, User } from 'types/edit-profile/types';
import { AppRoute } from '../../data/enum';
import { logoutAction } from '../../store/authorization/actions';
import Breadcrumbs from '../breadcrumbs';

export const Header: React.FunctionComponent = (props) => {
    const user = useSelector<RootState>((state) => state.auth.user)
    console.log(user);
    

    const [showMenu, setShowMenu] = useState<boolean>(false)
    const [showProfile, setShowProfile] = useState<boolean>(false)

    const profileRef = useRef(null)
    const dispatch = useDispatch()
    const history = useHistory()

    // TODO: Kludge! Need to rework
    const hideUser = history.location.pathname === '/sign-up' || history.location.pathname === '/reset-password'  

    const useOutsideClick = (ref: any, callback: any) => {
        useEffect(() => {
            const handleClickOutside = (event: any) => {
                if (ref.current && !ref.current.contains(event.target)) {
                    callback(false)
                }
            }
            document.addEventListener("mousedown", handleClickOutside);
            return () => {
                document.removeEventListener("mousedown", handleClickOutside);
            };
        }, [ref]);
    }
    useOutsideClick(profileRef, setShowMenu)

    const handleChangeRoute = (route: string) => {
        dispatch(changeRoute(route))
        route === AppRoute.Login && dispatch(logoutAction())
        history.push(route)
    }

    const username: any = !!user ? user : ''

    // TODO: Rework login process
    const logged: boolean = username.id !== 0 
    
    return (
        <div className="header">
            <div className="header__content">
                <div className="header__logo">
                    <SVG icon={logoImg} name="logo" onClick={() => !!user ? history.push('/') : null} />
                    {user && logged && (<Breadcrumbs className="header__breadcrumbs" />)}
                </div>

                {username && logged && !hideUser && (<div className="header__nav">
                    <div className="header__nav-item">
                        <div className="profile" ref={profileRef} onClick={() => setShowMenu(!showMenu)}>
                            {(user as IUser).firstName} {(user as IUser).lastName}
                            
                            <SVG icon={arrowImg} className={classNames("profile__arrow", { 'opened': showMenu })} />
                            <div className={classNames('profile__dropdown', { showMenu: showMenu })}>
                                <div className="profile__dropdown-triangle" />
                                <div className="profile__dropdown-item" onClick={() => { setShowProfile(true) }}>
                                    <SVG icon={profileImg} name="profileImg" /> My Account
                                </div>
                                <div className="profile__dropdown-item" onClick={() => { }}>
                                    <SVG icon={settingsImg} name="settingsImg" /> Settings
                                </div>
                                <div className="profile__dropdown-item" onClick={() => handleChangeRoute(AppRoute.Login)}>
                                    <SVG icon={logoutImg} name="logoutImg" /> Log Out
                                </div>
                            </div>
                        </div>
                    </div>
                </div>)}
                {
                    showProfile &&
                    <EditPassword user={user as IUser} onClose={() => setShowProfile(false)}/>
                }
            </div>
        </div>
    )
}
