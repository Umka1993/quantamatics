import React, { FunctionComponent, SVGProps } from "react";
import { NavLink, useNavigate, useLocation } from "react-router-dom";
import { AppRoute, UserRole } from "../../data/enum";

import ZoomIcon from "./assets/zoom.svg";
import CoherenceIcon from "./assets/coherence.svg";
import ExcelIcon from "./assets/excel.svg";
import OrganizationsIcon from "./assets/org.svg";
import CogsIcon from "./assets/cogs.svg";
import FilesIcon from "./assets/files.svg";
import ShareIcon from "./assets/share.svg";

import "./style/navbar.scss";
import classNames from "classnames";
import useUser from "../../hooks/useUser";
import Accordion from "../accordion";

interface NavBarProps {
    collapsed: boolean;
    className?: string,
}

interface NavLinkContent {
    href: string;
    text: string;
    icon: FunctionComponent<SVGProps<SVGSVGElement>>;
}

const NavBar: FunctionComponent<NavBarProps> = ({ className, collapsed }) => {
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
        <nav
            className={classNames("navigation", className, {
                "navigation--collapsed": collapsed,
            })}
        >
            {user?.userRoles.includes(UserRole.Research) && (
                <Accordion
                    isOpened={pathname.includes("/research")}
                    summaryClass="navigation__item"
                    summary={
                        <>
                            <ZoomIcon
                                aria-hidden="true"
                                className="navigation__icon"
                                width="16"
                                height="16"
                            />
                            Research
                        </>
                    }
                    wrapperClass='navigation__sublist'
                >
                    {subItems.map((item) => (
                        <NavLink
                            to={item.href}
                            className={({ isActive }) => {
                                const classes = ["navigation__item", "navigation__item--sub"];
                                isActive && classes.push("navigation__item--active");
                                return classes.join(" ");
                            }}
                            key={item.href}
                        >
                            <item.icon
                                aria-hidden="true"
                                className="navigation__icon"
                                width={16}
                                height={16}
                            />
                            {item.text}
                        </NavLink>
                    ))}
                </Accordion>
            )}

            {user?.userRoles.includes(UserRole.Coherence) && (
                <NavLink
                    to={AppRoute.Coherence}
                    className={({ isActive }) =>
                        isActive
                            ? "navigation__item navigation__item--active"
                            : "navigation__item"
                    }
                >
                    <CoherenceIcon 
                        aria-hidden={true}
                        className="navigation__icon"
                        width={16}
                        height={16}
                    />
                    Coherence
                </NavLink>
            )}

            {user?.userRoles.includes(UserRole.Coherence) && (
                <NavLink
                    to={AppRoute.ExcelLibrary}
                    className={({ isActive }) =>
                        isActive
                            ? "navigation__item navigation__item--active"
                            : "navigation__item"
                    }
                    >
                    <ExcelIcon 
                        aria-hidden={true}
                        className="navigation__icon"
                        width={16}
                        height={16}
                    />
                    Excel Library
                </NavLink>
            )}

            {isHaveAccessToOrgList && (
                <NavLink
                    to="/apps/organizations/list"
                    className={(isActive) =>
                        classNames("navigation__item", {
                            "navigation__item--active":
                                pathname.includes("/apps/organizations/") &&
                                !pathname.includes(
                                    `/apps/organizations/${user?.organizationId}`
                                ),
                        })
                    }
                >
                    <OrganizationsIcon
                        aria-hidden={true}
                        className="navigation__icon"
                        width={16}
                        height={16}
                    />
                    Organizations
                </NavLink>
            )}

            {user?.userRoles.includes(UserRole.OrgAdmin) && (
                <NavLink
                    to={`/apps/organizations/${user?.organizationId}`}
                    className={({ isActive }) =>
                        isActive
                            ? "navigation__item navigation__item--active"
                            : "navigation__item"
                    }
                >
                    <CogsIcon
                        aria-hidden={true}
                        className="navigation__icon"
                        width={16}
                        height={16}
                    />
                    Settings
                </NavLink>
            )}
        </nav>
    );
};

export default NavBar;
