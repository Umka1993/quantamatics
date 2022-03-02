import React, { useEffect, ReactElement, useState } from "react";
import { getCookie } from "../../services/cookies";
import useLogout from "../../hooks/useLogout";
import { SideBar } from "../../components/side-bar";
import style from "./with-sidebar.module.scss";
import PrivateRoutes from "../../router/private-routes";
import { EditPassword } from "../../components/edit-modal/edit-password";

import { useLocation } from "react-router-dom";
import useUser from "../../hooks/useUser";
import { useGetUserQuery } from "../../api/user";
import { useDispatch } from "react-redux";
import { login } from "../../store/authorization";

export default function WithSideBarLayout(): ReactElement {
    const logout = useLogout();
    const { pathname } = useLocation();

    const { id, userRoles } = useUser();
    const { data: user, isSuccess: isUserLoaded } = useGetUserQuery(id);
    const dispatch = useDispatch();

    const [showProfile, setShowProfile] = useState<boolean>(false);

    useEffect(() => {
        !getCookie("user") && logout();
    }, [pathname]);

    useEffect(() => {
        if (isUserLoaded && user && dispatch) {
            const normalizedUser = { ...user, userRoles };
            localStorage.setItem("user", JSON.stringify(normalizedUser));
            dispatch(login(normalizedUser));
        }
    }, [isUserLoaded, dispatch, userRoles]);

    return (
        <>
            <SideBar openModal={() => setShowProfile(true)} />
            <main className={style.main}>
                <PrivateRoutes />
            </main>

            {showProfile && user && (
                <EditPassword onClose={() => setShowProfile(false)} />
            )}
        </>
    );
}
