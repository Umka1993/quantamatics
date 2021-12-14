import React, { useEffect, ReactElement } from 'react';
import { getCookie } from '../../services/cookies';
import useLogout from '../../hooks/useLogout';
import { SideBar } from '../../components/side-bar';
import style from './with-sidebar.module.scss';
import PrivateRoutes from '../../router/private-routes';

export default function WithSideBarLayout(): ReactElement {
    const logout = useLogout();
    useEffect(() => {
        !getCookie('user') && logout();
    }, [document.cookie])

    return (
        <>
            <SideBar />
            <main className={style.main}>
                <PrivateRoutes />
            </main>
        </>
    );
}
