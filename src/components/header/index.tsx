import React from 'react';
import "./styles/header.scss"
import logoImg from "./assets/logo.svg"
import searchImg from "./assets/search.svg"
import ringImg from "./assets/ring.svg"
import avatar from "./assets/avatar.svg"
import arrowImg from "./assets/arrow.svg"



export const Header: React.FunctionComponent = (props) => {
    return(
        <div className="header">
           <div className="header__logo">
               <img src={logoImg} alt="logo"/>
               <span>Quantamatics</span>
           </div>
            <div className="header__nav">
                <div className="header__nav-item">
                   <img src={searchImg} alt="search"/>
                </div>
                <div className="header__nav-item">
                    <img src={ringImg} alt="ring"/>
                </div>
                <div className="header__nav-item">
                    <div className="profile">
                        <div className="profile__avatar">
                            <img src={avatar} alt="avatar"/>
                        </div>
                        <img src={arrowImg} className="profile__arrow"/>
                    </div>
                </div>
            </div>
        </div>
    )
}