import React, { FunctionComponent, SVGProps } from "react";
import { NavLink, useLocation } from "react-router-dom";
import { AppRoute, UserRole } from "../../data/enum";

import { ReactComponent as ZoomIcon } from "./assets/zoom.svg";
import { ReactComponent as CoherenceIcon } from "./assets/coherence.svg";
import { ReactComponent as ExcelIcon } from "./assets/excel.svg";
import { ReactComponent as OrganizationsIcon } from "./assets/org.svg";
import { ReactComponent as CogsIcon } from "./assets/cogs.svg";
import { ReactComponent as UsersIcon } from "./assets/users.svg";

import "./style/navbar.scss";
import classNames from "classnames";
import useUser from "../../hooks/useUser";

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


	return (
		<nav
			className={classNames("navigation", className, {
				"navigation--collapsed": collapsed,
			})}
		>
			{user?.allowResearch && (
				<NavLink
					to={AppRoute.Files}
					className={({ isActive }) =>
						isActive
							? "navigation__item navigation__item--active"
							: "navigation__item"
					}
				>
					<ZoomIcon
						aria-hidden="true"
						className="navigation__icon"
						width="16"
						height="16"
					/>
					Research
				</NavLink>
			)}

			{user?.allowCoherence && (
				<NavLink
					to={AppRoute.Coherence}
					className={({ isActive }) =>
						isActive
							? "navigation__item navigation__item--active"
							: "navigation__item"
					}
				>
					<CoherenceIcon
						aria-hidden
						className="navigation__icon"
						width={16}
						height={16}
					/>
					Coherence
				</NavLink>
			)}

			{user?.allowExcelLibrary && (
				<NavLink
					to={AppRoute.ExcelLibrary}
					className={({ isActive }) =>
						isActive
							? "navigation__item navigation__item--active"
							: "navigation__item"
					}
				>
					<ExcelIcon
						aria-hidden
						className="navigation__icon"
						width={16}
						height={16}
					/>
					Excel Library
				</NavLink>
			)}

			{isHaveAccessToOrgList && (
				<NavLink
					to={AppRoute.OrganizationList}
					className={
						classNames("navigation__item", {
							"navigation__item--active":
								pathname.includes("organizations") &&
								!pathname.includes(
									user?.organizationId
								),
						})
					}
				>
					<OrganizationsIcon
						aria-hidden
						className="navigation__icon"
						width={16}
						height={16}
					/>
					Organizations
				</NavLink>
			)}

			<NavLink
				to={AppRoute.Users}
				className={({ isActive }) =>
					isActive
						? "navigation__item navigation__item--active"
						: "navigation__item"
				}
			>
				<UsersIcon
					aria-hidden
					className="navigation__icon"
					width={16}
					height={16}
				/>
				User Accounts
			</NavLink>

			{user?.userRoles.includes(UserRole.OrgAdmin) && (
				<NavLink
					to={`/organizations/${user?.organizationId}`}
					className={({ isActive }) =>
						isActive
							? "navigation__item navigation__item--active"
							: "navigation__item"
					}
				>
					<CogsIcon
						aria-hidden
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
