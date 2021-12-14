import React, { ReactElement } from "react";
import { useSelector } from "react-redux";
import { RootState } from "../store";

import { AuthorizationStatus } from "../data/enum"
import UnLoggedLayout from "./unlogged";
import PrivateRoutes from "../router/private-routes";

export default function BaseLayout(): ReactElement {
    const currentStatus = useSelector((state: RootState) => state.auth.status);
    return currentStatus === AuthorizationStatus.Auth ?
        <PrivateRoutes /> :
        <UnLoggedLayout />
}

