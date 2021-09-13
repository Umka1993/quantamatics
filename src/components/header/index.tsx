import React from 'react';
import "./styles/header.scss"
import logoImg from "./assets/logo.svg"
import searchImg from "./assets/search.svg"
import ringImg from "./assets/ring.svg"
import avatar from "./assets/avatar.svg"
import arrowImg from "./assets/arrow.svg"
import SVG from '../SVG'
import {useSelector} from "react-redux";
import {UserState} from "../../store/user/reducer";


export const Header: React.FunctionComponent = (props) => {
    const user = useSelector<UserState, UserState["user"]>((state) => state.user)

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
                    <div className="profile">
                        <div className="profile__avatar">
                            <SVG icon={avatar} name="avatar"/>
                        </div>
                        <SVG icon={arrowImg} className="profile__arrow"/>
                    </div>
                </div>
            </div>
        </div>
    )
}
