import React, { FunctionComponent, SVGProps } from "react";
import { NavLink, useNavigate, useLocation } from "react-router-dom";
import { AppRoute, UserRole } from "../../data/enum";

import ZoomIcon from "./assets/zoom.svg";
import CoherenceIcon from "./assets/coherence.svg";
import OrganizationsIcon from "./assets/org.svg";
import CogsIcon from "./assets/cogs.svg";
import FilesIcon from "./assets/files.svg";
import ShareIcon from "./assets/share.svg";

import "./style/navbar.scss";
import classNames from "classnames";
import useUser from "../../hooks/useUser";

interface NavBarProps {
    collapsed: boolean;
}

interface NavLinkContent {
    href: string,
    text: string,
    icon: FunctionComponent<SVGProps<SVGSVGElement>>,
}

const NavBar: FunctionComponent<NavBarProps> = ({ collapsed }) => {
    const { pathname } = useLocation();
    const user = useUser();

    const isHaveAccessToOrgList =
        user?.userRoles.includes(UserRole.Admin) ||
        user?.userRoles.includes(UserRole.OrgOwner);

    const subItems: NavLinkContent[] = [
        { href: AppRoute.Files, text: "My Files", icon: FilesIcon },
        { href: AppRoute.Shared, text: "Shared With Me", icon: ShareIcon },
    ];

    return (
        <nav className={classNames("navigation", { "navigation--collapsed": collapsed })}>
            {user?.userRoles.includes(UserRole.Research) && (
                <details open={pathname.includes("/research") ? true : undefined}>
                    <summary className="navigation__item">
                        <ZoomIcon 
                            aria-hidden="true" className="navigation__icon"
                            width="16" height="16"
                        />
                        Research
                    </summary>
                    <div className="navigation__sublist">
                        {subItems.map((item) => (
                            <NavLink
                                to={item.href}
                                className={({ isActive }) => {
                                    const classes = ['navigation__item', 'navigation__item--sub']
                                    isActive && classes.push('navigation__item--active');
                                    return classes.join(' ');
                                }}
                                key={item.href}
                            >
                                <item.icon 
                                    aria-hidden="true" className="navigation__icon"
                                    width="16" height="16"
                                />
                                {item.text}
                            </NavLink>
                        ))}
                    </div>
                </details>
            )}

            {user?.userRoles.includes(UserRole.Coherence) && (
                <NavLink
                    to={AppRoute.Coherence}
                    className={({ isActive }) => isActive ? 'navigation__item navigation__item--active' : 'navigation__item'}
                >
                    <CoherenceIcon aria-hidden="true" className="navigation__icon" />
                    Coherence
                </NavLink>
            )}

            {isHaveAccessToOrgList && (
                <NavLink
                    to="/apps/organizations/list"

                    className={(isActive) => classNames("navigation__item", {
                        "navigation__item--active":
                            pathname.includes("/apps/organizations/") &&
                            !pathname.includes(`/apps/organizations/${user?.organizationId}`),
                    })}
                >
                    <OrganizationsIcon aria-hidden="true" className="navigation__icon" />
                    Organizations
                </NavLink>
            )}

            {user?.userRoles.includes(UserRole.OrgAdmin) && (
                <NavLink
                    to={`/apps/organizations/${user?.organizationId}`}
                    className={({ isActive }) => isActive ? 'navigation__item navigation__item--active' : 'navigation__item'}
                >
                    <CogsIcon aria-hidden="true" className="navigation__icon" />
                    Settings
                </NavLink>
            )}
        </nav>
    );
};

export default NavBar;
