import { EditPassword } from '../edit-modal/edit-password';
import React, { ReactElement, useState } from 'react';
import useUser from '../../hooks/useUser';
import ProfileIcon from './assets/profile.svg';
import LogoutIcon from './assets/logout.svg';
import CrossIcon from './assets/cross.svg';
import useLogout from '../../hooks/useLogout';
import style from './user-menu.module.scss';

export default function UserMenu(): ReactElement {
    const user = useUser();
    const logout = useLogout();

    const [showProfile, setShowProfile] = useState<boolean>(false);
    const [openDropdown, setOpenDropdown] = useState<boolean>(false);

    return (
        <>
            <button
                aria-label='Open user menu'
                className={style.trigger}
                onClick={() => setOpenDropdown(!openDropdown)}
            >
                <ProfileIcon
                    aria-hidden={true}
                    width={20} height={20}
                    fill='currentColor'
                />
                {user?.firstName} {user?.lastName}
            </button>
            {openDropdown &&
                <div className={style.menu}>
                    <button
                        type='button'
                        onClick={() => setOpenDropdown(false)}
                        className={style.close}
                    >
                        <CrossIcon
                            width={16}
                            height={16}
                            role='img'
                            aria-label='Close dropdown'
                        />
                    </button>
                    <button
                        type='button'
                        onClick={() => {
                            setShowProfile(true);
                        }}
                        className={style.button}
                    >
                        <ProfileIcon
                            aria-hidden={true}
                            width={20} height={20}
                            fill='currentColor'

                        />
                        My Account
                    </button>
                    <button
                        onClick={logout}
                        type='button'
                        className={style.button}
                    >
                        <LogoutIcon
                            aria-hidden={true}
                            width={16} height={16}
                            fill='currentColor'
                        />
                        Log Out
                    </button>

                </div>
            }


            {showProfile && user && (
                <EditPassword
                    user={user}
                    onClose={() => setShowProfile(false)}
                />
            )
            }
        </>
    );
}
