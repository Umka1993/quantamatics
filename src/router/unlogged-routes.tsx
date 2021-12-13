import { AppInfo, AppRoute } from "../data/enum";
import React, { FunctionComponent, useEffect } from "react";
import { Route, Routes, Navigate } from "react-router-dom";
import { getCookie } from "../services/cookies";
import { logoutFromJupiter } from "../services/logoutFromJupiter";
import style from './styles/unlogged.module.scss'
import { LoginForm, ResetPasswordForm, ForgotPasswordForm, SignUpForm } from "../components/form";
import SuccessMessage from "../components/success-message";
import { SubscriptionExpired, ResetPasswordExpired } from "../components/info-message/";

const UnLoggedRoutes: FunctionComponent = () => {
    useEffect(() => {
        getCookie('user') && logoutFromJupiter();
    }, [document.cookie])


    return (
        <>
            <header className={style.header}>
                <img
                    src={AppInfo.LogoPath}
                    alt={`Logotype of ${AppInfo.Name}`}
                    width={196} height={37}
                />
            </header>
            <main className={style.main}>
                <Routes>
                    <Route path={AppRoute.Login} element={<LoginForm />} />
                    <Route path={AppRoute.ForgotPassword} element={<ForgotPasswordForm />} />
                    <Route path={AppRoute.ResetPassword} element={<ResetPasswordForm />} />
                    <Route path={AppRoute.SignUp} element={<SignUpForm />} />
                    <Route path={AppRoute.Expired} element={<SubscriptionExpired />} />

                    <Route path={AppRoute.ExpiredPassword} element={<ResetPasswordExpired
                        headline='The password reset link can only be used once'
                        subtitle='Please return to Sign in page and choose Forgot Password.'
                    />} />
                    <Route path={AppRoute.SignUpExpired} element={<ResetPasswordExpired
                        headline='Set password link can only be used once'
                        subtitle='Please return to Sign in page and choose Forgot Password.'
                    />} />
                    <Route path={AppRoute.NoRoles} element={<ResetPasswordExpired
                        headline='Your user account is in the process of being set up'
                        subtitle='Please try again later or start a chat session to get help live from someone on our team.'
                        returnBack={false}
                    />} />
                    <Route element={<Navigate to={AppRoute.Login} />} />
                </Routes>
            </main>

        </>
    )

};

export default UnLoggedRoutes;
