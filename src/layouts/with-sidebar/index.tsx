import React, {useEffect, ReactElement, useState} from 'react';
import {getCookie} from '../../services/cookies';
import useLogout from '../../hooks/useLogout';
import {SideBar} from '../../components/side-bar';
import style from './with-sidebar.module.scss';
import PrivateRoutes from '../../router/private-routes';
import {EditPassword} from '../../components/edit-modal/edit-password';
import useUser from '../../hooks/useUser';
import {useLocation} from 'react-router-dom';
import {useUpdateUserMutation, useUpdateUserRolesMutation} from "../../api/user";
import Loader from "../../components/loader";
import {useGetOrganizationQuery} from "../../api/organization";

export default function WithSideBarLayout(): ReactElement {
    const logout = useLogout();
    const {pathname} = useLocation();
    const user = useUser();
    const [showProfile, setShowProfile] = useState<boolean>(false);
    const {isLoading = true} = useGetOrganizationQuery('');


    useEffect(() => {
        !getCookie('user') && logout();
    }, [pathname])

    return (
        <>
            <SideBar openModal={() => setShowProfile(true)}/>
            <main className={style.main}>
                    <PrivateRoutes/>
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
