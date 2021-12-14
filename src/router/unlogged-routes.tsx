import { AppRoute } from "../data/enum";
import React, { ReactElement } from "react";
import { Route, Routes, Navigate } from "react-router-dom";
import {
    LoginForm,
    ResetPasswordForm,
    ForgotPasswordForm,
    SignUpForm,
} from "../components/form";
import SuccessMessage from "../components/success-message";
import InfoMessage from "../components/info-message/info-message";

export default function UnLoggedRoutes(): ReactElement {
    return (
        <Routes>
            <Route path="*" element={<Navigate to={AppRoute.Login} />} />
            <Route path={AppRoute.Login} element={<LoginForm />} />
            <Route
                path={AppRoute.ForgotPassword}
                element={<ForgotPasswordForm />}
            />
            <Route
                path={AppRoute.ResetPassword}
                element={<ResetPasswordForm />}
            />
            <Route path={AppRoute.SignUp} element={<SignUpForm />} />
            <Route path={AppRoute.Expired} element={<InfoMessage />} />
            <Route path={AppRoute.NoRoles} element={<InfoMessage />} />
            <Route path={AppRoute.Success} element={<SuccessMessage />} />
        </Routes>
    );
}
