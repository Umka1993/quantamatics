import React, { useState, useRef, useEffect } from 'react';
import "./styles/header.scss"
import logoImg from "./assets/logo.svg"
import searchImg from "./assets/search.svg"
import ringImg from "./assets/ring.svg"
import avatar from "./assets/avatar.svg"
import arrowImg from "./assets/arrow.svg"
import profileImg from "./assets/profile.svg"
import settingsImg from "./assets/settings.svg"
import logoutImg from "./assets/logout.svg"
import SVG from '../SVG'
import {useSelector} from "react-redux";
import {UserState} from "../../store/user/reducer";
import classNames from "classnames";


export const Header: React.FunctionComponent = (props) => {
    const user = useSelector<UserState, UserState["user"]>((state) => state.user)
    const [showMenu, setShowMenu] = useState<boolean>(false)
    const profileRef = useRef(null)

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

    return(
        <div className="header">
           <div className="header__logo">
               <SVG icon={logoImg} name="logo"/>
               <span>Quantamatics</span>
           </div>
            <div className="header__nav">
                <div className="header__nav-item">
                   <SVG icon={searchImg} name="search"/>
                </div>
                <div className="header__nav-item">
                    <SVG icon={ringImg} name="ring"/>
                </div>
                <div className="header__nav-item">
                    <div className="profile" ref={profileRef} onClick={() => setShowMenu(!showMenu)}>
                        <div className="profile__avatar">
                            <SVG icon={avatar} name="avatar"/>
                        </div>
                        <SVG icon={arrowImg} className={classNames("profile__arrow", {'opened': showMenu})}/>
                        {showMenu && (
                            <div className='profile__dropdown'>
                                <div className="profile__dropdown-triangle"/>
                                <div className="profile__dropdown-item">
                                    <SVG icon={profileImg} name="profileImg"/> Profile
                                </div>
                                <div className="profile__dropdown-item">
                                    <SVG icon={settingsImg} name="settingsImg"/> Settings
                                </div>
                                <div className="profile__dropdown-item">
                                    <SVG icon={logoutImg} name="logoutImg"/> Log Out
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
}
