import React, { FunctionComponent } from 'react';
import { useHistory } from 'react-router';
import { NavLink } from 'react-router-dom';
import { AppRoute } from '../../data/enum';

import DocIcon from './assets/doc.svg'
import CoherenceIcon from './assets/coherence.svg'
import OrganizationsIcon from './assets/org.svg'
import CogsIcon from './assets/cogs.svg'
import FilesIcon from './assets/files.svg'
import ShareIcon from './assets/share.svg'
import FavoritesIcon from './assets/favorites.svg'

import ToggleArrow from './assets/toggle-arrow.svg'

import './style/navbar.scss'
import classNames from 'classnames';

interface NavBarProps {

}

const NavBar: FunctionComponent<NavBarProps> = () => {
    const { location: { pathname } } = useHistory();
    return (
        <nav className='navigation'>
            <details open={pathname.includes('/research') ? true : undefined} >
                <summary className='navigation__item'>
                    <DocIcon aria-hidden='true' className='navigation__icon' />
                    Research
                    <ToggleArrow aria-hidden='true' className='navigation__marker' />
                </summary>
                <div className="navigation__sublist">
                    <NavLink
                        to={AppRoute.Files} className='navigation__item navigation__item--sub' activeClassName='navigation__item--active'
                    >
                        <FilesIcon aria-hidden='true' className='navigation__icon' />
                        My Files
                    </NavLink>

                    <NavLink
                        to={AppRoute.Shared} className='navigation__item navigation__item--sub' activeClassName='navigation__item--active'
                    >
                        <ShareIcon aria-hidden='true' className='navigation__icon' />
                        Shared With Me
                    </NavLink>

                    <NavLink
                        to={AppRoute.Favorites} className='navigation__item navigation__item--sub' activeClassName='navigation__item--active'
                    >
                        <FavoritesIcon aria-hidden='true' className='navigation__icon' />
                        Favorites
                    </NavLink>
                </div>
            </details>

            <NavLink
                to={AppRoute.Coherence} className='navigation__item' activeClassName='navigation__item--active'
            >
                <CoherenceIcon aria-hidden='true' className='navigation__icon' />
                Coherence
            </NavLink>
            <NavLink
                to='/apps/organizations/list'
                className={
                    classNames('navigation__item', 
                    { 'navigation__item--active': pathname.includes('/apps/organizations/') })
                }
            >
                <OrganizationsIcon aria-hidden='true' className='navigation__icon' />
                Organizations
            </NavLink>

            <NavLink
                to={AppRoute.Settings} className='navigation__item' activeClassName='navigation__item--active'
            >
                <CogsIcon aria-hidden='true' className='navigation__icon' />
                Settings
            </NavLink>
        </nav >
    );
}

export default NavBar;