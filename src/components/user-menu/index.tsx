import React, { Dispatch, ReactElement, SetStateAction, useEffect, useState } from "react";
import ProfileIcon from "./assets/profile.svg";
import LogoutIcon from "./assets/logout.svg";
import PowerIcon from "./assets/power.svg";
import CrossIcon from "./assets/cross.svg";
import useLogout from "../../hooks/useLogout";
import style from "./user-menu.module.scss";
import useCloseModal from "../../hooks/useCloseModal";
import { SideBarModalOpen } from "../../types/sidebar-modal";

interface Props {
    openModal: SideBarModalOpen;
    openDropdown: boolean;
    setOpenDropdown: Dispatch<SetStateAction<boolean>>;
}

export default function UserMenu({
	openModal,
	openDropdown, setOpenDropdown
}: Props): ReactElement {
	const logout = useLogout();
	useCloseModal(openDropdown, setOpenDropdown);

	return (
		<div className={style.menu} onClick={(e) => e.stopPropagation()}>
			<button
				type="button"
				onClick={() => setOpenDropdown(false)}
				className={style.close}
			>
				<CrossIcon
					width={16}
					height={16}
					role="img"
					aria-label="Close dropdown"
				/>
			</button>
			<button
				type="button"
				onClick={() => {
					openModal("my-account");
					setOpenDropdown(false);
				}}
				className={style.button}
			>
				<ProfileIcon
					aria-hidden={true}
					width={20}
					height={20}
					fill="currentColor"
				/>
                My Account
			</button>
			<button
				type="button"
				onClick={() => {
					openModal("restart-server");
					setOpenDropdown(false);
				}}
				className={style.button}
			>
				<PowerIcon aria-hidden width={16} height={16} fill="currentColor" />
                Restart Server
			</button>
			<button onClick={logout} type="button" className={style.button}>
				<LogoutIcon
					aria-hidden={true}
					width={16}
					height={16}
					fill="currentColor"
				/>
                Log Out
			</button>
		</div>


	);
}
