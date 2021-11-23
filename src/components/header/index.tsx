import React, { useState, useRef, useEffect } from 'react';
import "./styles/header.scss"
import logoImg from "./assets/new-logo.svg"
import logoTextImg from "./assets/Quantamatics.svg"
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
import { IUser, User } from 'types/edit-profile/types';
import { AppRoute, AuthorizationStatus } from '../../data/enum';
import Breadcrumbs from '../breadcrumbs';
import { logout } from '../../store/authorization';
import { EXCEL_PLUGIN } from '../../data/constants';
import DownLoadIcon from './assets/download.svg'

export const Header: React.FunctionComponent = (props) => {
    const { user, status } = useSelector((state: RootState) => state.auth)

    const [showMenu, setShowMenu] = useState<boolean>(false)
    const [showProfile, setShowProfile] = useState<boolean>(false)

    const profileRef = useRef(null)
    const dispatch = useDispatch()
    const history = useHistory()

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
        route === AppRoute.Login && dispatch(logout())
        history.push(route)
    }

    return (
        <div className="header">
            <div className="header__content">
                <div className="header__logo">
                    <SVG icon={logoImg} name="logo" onClick={() => !!user ? history.push('/') : null} />
                    {status === AuthorizationStatus.Auth && (<Breadcrumbs className="header__breadcrumbs" />)}
                </div>

                {status === AuthorizationStatus.Auth && (
                    <>
                        <a
                            className='header__excel'
                            href={EXCEL_PLUGIN} download
                        >
                            Get Excel Plug-in
                            <DownLoadIcon
                                fill="#BCC4D8"
                                width={16} height={16}
                                aria-hidden="true"
                            />
                        </a>


                        <div className="profile header__user" ref={profileRef} onClick={() => setShowMenu(!showMenu)}>
                            {(user as IUser).firstName} {(user as IUser).lastName}

                            <SVG icon={arrowImg} className={classNames("profile__arrow", { 'opened': showMenu })} />
                            <div className={classNames('profile__dropdown', { showMenu: showMenu })}>
                                <div className="profile__dropdown-triangle" />
                                <div className="profile__dropdown-item" onClick={() => { setShowProfile(true) }}>
                                    <SVG icon={profileImg} name="profileImg" /> My Account
                                </div>
                                <div className="profile__dropdown-item" onClick={() => handleChangeRoute(AppRoute.Login)}>
                                    <SVG icon={logoutImg} name="logoutImg" /> Log Out
                                </div>
                            </div>
                        </div>


                    </>)}
                {
                    showProfile &&
                    <EditPassword user={user as IUser} onClose={() => setShowProfile(false)} />
                }
            </div>
        </div>
    )
}
