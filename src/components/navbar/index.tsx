import React, { FunctionComponent, SVGProps } from "react";
import { useHistory } from "react-router";
import { NavLink } from "react-router-dom";
import { AppRoute, UserRole } from "../../data/enum";

import DocIcon from "./assets/doc.svg";
import CoherenceIcon from "./assets/coherence.svg";
import OrganizationsIcon from "./assets/org.svg";
import CogsIcon from "./assets/cogs.svg";
import FilesIcon from "./assets/files.svg";
import ShareIcon from "./assets/share.svg";
import FavoritesIcon from "./assets/favorites.svg";

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
    const {
        location: { pathname },
    } = useHistory();
    const user = useUser();

    const isHaveAccessToOrgList =
        user?.userRoles.includes(UserRole.Admin) ||
        user?.userRoles.includes(UserRole.OrgOwner);

    const subItems: NavLinkContent[] = [
        { href: AppRoute.Files, text: "My Files", icon: FilesIcon },
        { href: AppRoute.Shared, text: "Shared With Me", icon: ShareIcon },
        { href: AppRoute.Favorites, text: "Favorites", icon: FavoritesIcon },
    ];

    return (
        <nav className={classNames("navigation", { "navigation--collapsed": collapsed })}>
            {user?.userRoles.includes(UserRole.Research) && (
                <details open={pathname.includes("/research") ? true : undefined}>
                    <summary className="navigation__item">
                        <DocIcon aria-hidden="true" className="navigation__icon" />
                        Research
                    </summary>
                    <div className="navigation__sublist">
                        {subItems.map((item) => (
                            <NavLink
                                to={item.href}
                                className="navigation__item navigation__item--sub"
                                activeClassName="navigation__item--active"
                                key={item.href}
                            >
                                <item.icon aria-hidden="true" className="navigation__icon" />
                                {item.text}
                            </NavLink>
                        ))}
                    </div>
                </details>
            )}

            {user?.userRoles.includes(UserRole.Coherence) && (
                <NavLink
                    to={AppRoute.Coherence}
                    className="navigation__item"
                    activeClassName="navigation__item--active"
                >
                    <CoherenceIcon aria-hidden="true" className="navigation__icon" />
                    Coherence
                </NavLink>
            )}

            {isHaveAccessToOrgList && (
                <NavLink
                    to="/apps/organizations/list"
                    className={classNames("navigation__item", {
                        "navigation__item--active":
                            pathname.includes("/apps/organizations/") &&
                            !pathname.includes(`/apps/organizations/${user?.organizationId}`),
                    })}
                    activeClassName="navigation__item--active"
                >
                    <OrganizationsIcon aria-hidden="true" className="navigation__icon" />
                    Organizations
                </NavLink>
            )}

            {user?.userRoles.includes(UserRole.OrgAdmin) && (
                <NavLink
                    to={`/apps/organizations/${user?.organizationId}`}
                    className="navigation__item"
                    activeClassName="navigation__item--active"
                >
                    <CogsIcon aria-hidden="true" className="navigation__icon" />
                    Settings
                </NavLink>
            )}
        </nav>
    );
};

export default NavBar;
