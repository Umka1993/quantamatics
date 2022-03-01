import React, { useEffect, ReactElement, useState } from 'react';
import { getCookie } from '../../services/cookies';
import useLogout from '../../hooks/useLogout';
import { SideBar } from '../../components/side-bar';
import style from './with-sidebar.module.scss';
import PrivateRoutes from '../../router/private-routes';
import { EditPassword } from '../../components/edit-modal/edit-password';

import { useLocation } from 'react-router-dom';

export default function WithSideBarLayout(): ReactElement {
    const logout = useLogout();
    const { pathname } = useLocation();

    const [showProfile, setShowProfile] = useState<boolean>(false);

    useEffect(() => {
        !getCookie('user') && logout();
    }, [pathname])

    return (
        <>
            <SideBar openModal={() => setShowProfile(true)} />
            <main className={style.main}>
                <PrivateRoutes />
            </main>

            {showProfile &&
                <EditPassword
                    onClose={() => setShowProfile(false)}
                />
            }
        </>
    );
}
