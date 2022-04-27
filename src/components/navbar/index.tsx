import { NavLink, useLocation } from "react-router-dom";
import { AppRoute, UserRole } from "../../data/enum";

import { ReactComponent as ZoomIcon } from "./assets/zoom.svg";
import { ReactComponent as CoherenceIcon } from "./assets/coherence.svg";
import { ReactComponent as ExcelIcon } from "./assets/excel.svg";
import { ReactComponent as OrganizationsIcon } from "./assets/org.svg";
import { ReactComponent as CogsIcon } from "./assets/cogs.svg";
import { ReactComponent as UsersIcon } from "./assets/users.svg";

import scss from "./navbar.module.scss";
import classNames from "classnames";
import useUser from "../../hooks/useUser";
import { HTMLAttributes } from "react";

type Props = HTMLAttributes<HTMLElement> & {
	collapsed: boolean;
}

export default function NavBar({ className, collapsed, ...other }: Props) {
	const { pathname } = useLocation();
	const user = useUser();

	const isSuperAdmin = user?.userRoles.includes(UserRole.OrgAdmin);

	const isHaveAccessToOrgList =
		isSuperAdmin || user?.userRoles.includes(UserRole.OrgOwner);

	const LINKS = [
		{
			isShown: user?.allowResearch,
			href: AppRoute.Files,
			icon: ZoomIcon,
			text: "Research",
		},
		{
			isShown: user?.allowCoherence,
			href: AppRoute.Coherence,
			icon: CoherenceIcon,
			text: "Coherence",
		},
		{
			isShown: user?.allowExcelLibrary,
			href: AppRoute.ExcelLibrary,
			icon: ExcelIcon,
			text: "Excel Library",
		},
		{
			isShown: isHaveAccessToOrgList,
			href: AppRoute.OrganizationList,
			icon: OrganizationsIcon,
			text: "Organizations",
			className: classNames(scss.link, {
				active:
					pathname.includes("organizations") &&
					!pathname.includes(user?.organizationId),
			}),
		},

		{
			isShown: isSuperAdmin,
			href: AppRoute.Users,
			icon: UsersIcon,
			text: "User Accounts",
		},

		{
			isShown: user?.userRoles.includes(UserRole.OrgAdmin),
			href: `/organizations/${user?.organizationId}`,
			icon: CogsIcon,
			text: "Settings",
		},
	];

	return (
		<nav
			className={classNames(
				{
					[scss.collapsed]: collapsed,
				},
				className
			)}
			{...other}
		>
			{LINKS.map(
				(link) =>
					link.isShown && (
						<NavLink
							to={link.href}
							className={link.className || scss.link}
							key={link.href}
						>
							<link.icon
								aria-hidden
								className={scss.icon}
								width={16}
								height={16}
								fill="#bcc4d8"
							/>
							{link.text}
						</NavLink>
					)
			)}
		</nav>
	);
}
