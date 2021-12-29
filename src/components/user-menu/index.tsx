import React, { ReactElement, useEffect, useState } from 'react';
import useUser from '../../hooks/useUser';
import ProfileIcon from './assets/profile.svg';
import LogoutIcon from './assets/logout.svg';
import CrossIcon from './assets/cross.svg';
import useLogout from '../../hooks/useLogout';
import style from './user-menu.module.scss';
import classnames from 'classnames';
import useCloseModal from '../../hooks/useCloseModal';

interface Props {
    collapsed: boolean;
    openModal: () => void; 
}

export default function UserMenu({ collapsed, openModal }: Props): ReactElement {
    const user = useUser();
    const logout = useLogout();
    const [openDropdown, setOpenDropdown] = useState<boolean>(false);

    useEffect(() => {
        collapsed && setOpenDropdown(false)
    }, [collapsed])

    useCloseModal(openDropdown, setOpenDropdown)

    return (
        <>
            <button
                aria-label='Open user menu'
                className={classnames(style.trigger, { [style['trigger--wide']]: !collapsed })}
                onClick={() => setOpenDropdown(!openDropdown)}
            >
                <ProfileIcon
                    aria-hidden={true}
                    width={20} height={20}
                    fill='currentColor'
                />
                {!collapsed && `${user?.firstName} ${user?.lastName}`}
            </button>
            {openDropdown &&
                <div className={style.menu} onClick={(e) => e.stopPropagation()}>
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
                        onClick={() => {openModal(); setOpenDropdown(false)}}
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
        </>
    );
}
