import React, { ReactElement, Suspense } from "react";
import { useSelector } from "react-redux";
import { RootState } from "../store";

import { AuthorizationStatus } from "../data/enum"
import Loader from "../components/loader";

const UnLoggedLayout = React.lazy(() => import('./unlogged'));
const WithSideBarLayout = React.lazy(() => import('./with-sidebar'));

export default function BaseLayout(): ReactElement {
    const currentStatus = useSelector((state: RootState) => state.auth.status);
    return currentStatus === AuthorizationStatus.Auth ?
        <Suspense fallback={<Loader />} ><WithSideBarLayout /></Suspense> :
        <Suspense fallback={<Loader />} ><UnLoggedLayout /></Suspense>
}

