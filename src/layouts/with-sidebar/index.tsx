import React, { useEffect, ReactElement, useState } from 'react';
import { getCookie } from '../../services/cookies';
import useLogout from '../../hooks/useLogout';
import { SideBar } from '../../components/side-bar';
import style from './with-sidebar.module.scss';
import PrivateRoutes from '../../router/private-routes';
import { EditPassword } from '../../components/edit-modal/edit-password';
import useUser from '../../hooks/useUser';

export default function WithSideBarLayout(): ReactElement {
    const logout = useLogout();

    const user = useUser();
    const [showProfile, setShowProfile] = useState<boolean>(false);

    useEffect(() => {
        !getCookie('user') && logout();
    }, [document.cookie])

    return (
        <>
            <SideBar openModal={() => setShowProfile(true)} />
            <main className={style.main}>
                <PrivateRoutes />
            </main>

            {showProfile && user &&
                <EditPassword
                    user={user}
                    onClose={() => setShowProfile(false)}
                />
            }
        </>
    );
}
