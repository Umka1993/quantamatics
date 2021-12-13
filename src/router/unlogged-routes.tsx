import { AppInfo, AppRoute } from "../data/enum";
import React, { FunctionComponent, useEffect } from "react";
import { Route, Routes, Navigate, Link } from "react-router-dom";
import { getCookie } from "../services/cookies";
import { logoutFromJupiter } from "../services/logoutFromJupiter";
import style from "./styles/unlogged.module.scss";
import {
    LoginForm,
    ResetPasswordForm,
    ForgotPasswordForm,
    SignUpForm,
} from "../components/form";
import SuccessMessage from "../components/success-message";
import InfoMessage from "../components/info-message/info-message";

const UnLoggedRoutes: FunctionComponent = () => {
    useEffect(() => {
        getCookie("user") && logoutFromJupiter();
    }, [document.cookie]);

    return (
        <>
            <header className={style.header}>
                <Link to={AppRoute.Home}>
                    <img
                        src={AppInfo.LogoPath}
                        alt={`Logotype of ${AppInfo.Name}`}
                        width={196}
                        height={37}
                    />
                </Link>
            </header>
            <main className={style.main}>
                <Routes>
                    <Route path="*" element={<Navigate to={AppRoute.Login} />} />
                    <Route path={AppRoute.Login} element={<LoginForm />} />
                    <Route path={AppRoute.ForgotPassword} element={<ForgotPasswordForm />} />
                    <Route path={AppRoute.ResetPassword} element={<ResetPasswordForm />} />
                    <Route path={AppRoute.SignUp} element={<SignUpForm />} />
                    <Route path={AppRoute.Expired} element={<InfoMessage />} />
                    <Route path={AppRoute.NoRoles} element={<InfoMessage />} />
                    <Route path={AppRoute.Success} element={<SuccessMessage />} />
                </Routes>
            </main>
        </>
    );
};

export default UnLoggedRoutes;
