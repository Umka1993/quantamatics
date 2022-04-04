import { ReactElement } from "react";
import { ReactComponent as ProfileIcon } from "./assets/profile.svg";
import { ReactComponent as LogoutIcon } from "./assets/logout.svg";
import { ReactComponent as PowerIcon } from "./assets/power.svg";
import useLogout from "../../hooks/useLogout";
import style from "./user-menu.module.scss";
import { SideBarModalMode, SideBarModalOpen } from "../../types/sidebar-modal";

import Dialog from "../dialog";
import { ModalProps } from "../dialog/types";

interface Props extends Pick<ModalProps, "open" | "onRequestClose"> {
	openModal: SideBarModalOpen;
}

export default function UserMenu({
	openModal,
	open,
	onRequestClose,
}: Props): ReactElement {
	const logout = useLogout();

	return (
		<Dialog
			open={open}
			onRequestClose={onRequestClose}
			modal={false}
			variant="user"
			closeOnOutsideClick
		>
			<button
				type="button"
				onClick={() => {
					openModal(SideBarModalMode.Account);
					onRequestClose();
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
					openModal(SideBarModalMode.Restart);
					onRequestClose();
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
		</Dialog>
	);
}
