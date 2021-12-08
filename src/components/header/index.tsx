import React, {
    useState,
    useRef,
    useEffect,
    CSSProperties,
    FunctionComponent,
} from "react";
import "./styles/header.scss";
import Logo from "./assets/logo.svg";
import arrowImg from "./assets/toggle-arrow.svg";
import profileImg from "./assets/profile.svg";
import logoutImg from "./assets/logout.svg";
import SVG from "../SVG";
import { useDispatch, useSelector } from "react-redux";
import classNames from "classnames";
import { RootState } from "../../store";
import { useHistory, Link } from "react-router-dom";
import { EditPassword } from "../edit-modal/edit-password";
import { IUser } from "types/edit-profile/types";
import { AuthorizationStatus } from "../../data/enum";
// import Breadcrumbs from '../breadcrumbs';
import { logout } from "../../store/authorization";
import { EXCEL_PLUGIN } from "../../data/constants";
import DownLoadIcon from "./assets/download.svg";
// import { useLogoutMutation } from "../../api/account";

export const Header: FunctionComponent = () => {
    const { user, status } = useSelector((state: RootState) => state.auth);

    const [showMenu, setShowMenu] = useState<boolean>(false);
    const [showProfile, setShowProfile] = useState<boolean>(false);

    const profileRef = useRef<HTMLDivElement>(null);
    const dispatch = useDispatch();
    const history = useHistory();
    const [summaryWidth, setSummaryWidth] = useState<number>(54);

    // const [logoutHook] = useLogoutMutation()

    const useOutsideClick = (ref: any, callback: any) => {
        useEffect(() => {
            const handleClickOutside = (event: any) => {
                if (ref.current && !ref.current.contains(event.target)) {
                    callback(false);
                }
            };
            document.addEventListener("mousedown", handleClickOutside);
            return () => {
                document.removeEventListener("mousedown", handleClickOutside);
            };
        }, [ref]);
    };
    useOutsideClick(profileRef, setShowMenu);

    useEffect(() => {
        if (profileRef.current) {
            const calculatedWidth = 160 - profileRef.current.offsetWidth;
            setSummaryWidth(calculatedWidth > 30 ? calculatedWidth : 30);
        }
    }, [profileRef.current, status]);

    return (
        <header className="header">
            <Link to="/" className="header__logo">
                <Logo width="201" height="38" aria-label="Quantamatics logotype" />
            </Link>

            {/* {status === AuthorizationStatus.Auth && (<Breadcrumbs className="header__breadcrumbs" />)} */}

            {status === AuthorizationStatus.Auth && (
                <div
                    className="header__right"
                    style={{ "--gap": summaryWidth + "px" } as CSSProperties}
                >
                    <a className="header__excel" href={EXCEL_PLUGIN} download>
                        <DownLoadIcon
                            fill="#BCC4D8"
                            width={16}
                            height={16}
                            aria-hidden="true"
                        />
                        Get Excel Plug-in
                    </a>

                    <hr />
                    <div
                        className="profile header__user"
                        ref={profileRef}
                        onClick={() => setShowMenu(!showMenu)}
                    >
                        {(user as IUser).firstName} {(user as IUser).lastName}
                        <SVG
                            icon={arrowImg}
                            className={classNames("profile__arrow", { opened: showMenu })}
                        />
                        <div
                            className={classNames("profile__dropdown", {
                                showMenu: showMenu,
                            })}
                        >
                            <div className="profile__dropdown-triangle" />
                            <div
                                className="profile__dropdown-item"
                                onClick={() => {
                                    setShowProfile(true);
                                }}
                            >
                                <SVG icon={profileImg} name="profileImg" /> My Account
                            </div>
                            <div
                                className="profile__dropdown-item"
                                onClick={() => {
                                    // logoutHook().unwrap();
                                    dispatch(logout());
                                }}
                            >
                                <SVG icon={logoutImg} name="logoutImg" /> Log Out
                            </div>
                        </div>
                    </div>
                </div>
            )}
            {showProfile && (
                <EditPassword
                    user={user as IUser}
                    onClose={() => setShowProfile(false)}
                />
            )}
        </header>
    );
};
