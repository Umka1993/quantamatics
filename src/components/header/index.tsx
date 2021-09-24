import React, { useState, useRef, useEffect } from 'react';
import "./styles/header.scss"
import logoImg from "./assets/logo.svg"
import logoTextImg from "./assets/Quantamatics.svg"
import searchImg from "./assets/search.svg"
import ringImg from "./assets/ring.svg"
import avatar from "./assets/avatar.svg"
import arrowImg from "./assets/arrow.svg"
import profileImg from "./assets/profile.svg"
import settingsImg from "./assets/settings.svg"
import logoutImg from "./assets/logout.svg"
import SVG from '../SVG'
import {useDispatch, useSelector} from "react-redux";
import classNames from "classnames";
import {RootState} from "../../store";
import {useHistory} from "react-router-dom";
import {changeRoute} from "../../store/currentPage/actions";


export const Header: React.FunctionComponent = (props) => {
    const user = useSelector<RootState>((state) => state.user.user.username)
    const [showMenu, setShowMenu] = useState<boolean>(false)
    const [breadcrumbs, setBreadcrumbs] = useState<Array<string>>([
        'Research',
        'My Files',
    ])
    const storeCurrentPage = useSelector<RootState>(
        (state) => state.currentPage.currentPage.pageName
    )
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
        if(route === 'login') {
            dispatch({
                type: "LOGOUT", payload: {
                    username: ''
                }
            })
            localStorage.removeItem('id_token')
            localStorage.removeItem('username')
        }
        history.push(route)

    }

    useEffect(() => {
        if (!user) history.push('/login')
    }, [user])

    useEffect(() => {
        const url: any = !!storeCurrentPage ? storeCurrentPage : ''
        const urlArray = url.split('/')
        const refactoredArray = urlArray.length === 1 ? [] : urlArray.map((item: string) => {
            return item.replace(/-/g, ' ')
        })
        setBreadcrumbs(refactoredArray)
    }, [storeCurrentPage])

    const breadcrumbsList = breadcrumbs.map((crumb: any, index) => {
        const listLength = breadcrumbs.length -1
        return (
            <div key={index} className={classNames('header__breadcrumbs-item', {'last': index === listLength})}>
                {crumb}
                {index !== listLength ? <span className='breadcrumb-divider'>/</span> : ''}
            </div>
        )
    })
    const username: any = !!user ? user : ''
    return(
        <div className="header">
            <div className="header__content">
                <div className="header__logo">
                   <SVG icon={logoImg} name="logo" onClick={() => history.push('/')}/>
                   <SVG icon={logoTextImg} name="text" onClick={() => history.push('/')}/>
                    {user && (<div className="header__breadcrumbs">
                        {breadcrumbsList}
                    </div>)}
                </div>

                {user && (<div className="header__nav">
                    {/*<div className="header__nav-item">*/}
                    {/*    <SVG icon={searchImg} name="search"/>*/}
                    {/*</div>*/}
                    {/*<div className="header__nav-item">*/}
                    {/*    <SVG icon={ringImg} name="ring"/>*/}
                    {/*</div>*/}
                    <div className="header__nav-item">
                        <div className="profile" ref={profileRef} onClick={() => setShowMenu(!showMenu)}>
                            <div className={classNames("profile__avatar", {'opened': showMenu})}>
                                {/*<SVG icon={avatar} name="avatar"/>*/}
                                <div className="img-wrapper"><img src={require("./assets/avatar-img.jpeg").default} alt="ava"/></div>

                            </div>
                            <span className='username'>{username}</span>
                            <SVG icon={arrowImg} className={classNames("profile__arrow", {'opened': showMenu})}/>
                            {showMenu && (
                                <div className='profile__dropdown'>
                                    <div className="profile__dropdown-triangle"/>
                                    <div className="profile__dropdown-item" onClick={() => {}}>
                                        <SVG icon={profileImg} name="profileImg"/> Profile
                                    </div>
                                    <div className="profile__dropdown-item" onClick={() => {}}>
                                        <SVG icon={settingsImg} name="settingsImg"/> Settings
                                    </div>
                                    <div className="profile__dropdown-item" onClick={() => handleChangeRoute('login')}>
                                        <SVG icon={logoutImg} name="logoutImg"/> Log Out
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>)}
            </div>
        </div>
    )
}
