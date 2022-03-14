import React, { ButtonHTMLAttributes, ReactElement } from "react";
import useUser from "../../hooks/useUser";
import ProfileIcon from "./assets/profile.svg";

interface Props extends ButtonHTMLAttributes<HTMLButtonElement> {
    collapsed: boolean;
}

export default function ProfileButton({
	collapsed,
	type = "button",
	...other
}: Props): ReactElement {
	const user = useUser();

	return (
		<button
			type={type}
			aria-label="Open user menu"
			{...other}
		>
			<ProfileIcon width={20} height={20} aria-hidden fill="currentColor" />
			{!collapsed && `${user?.firstName} ${user?.lastName}`}
		</button>
	);
}
