import { ReactElement } from "react";
import { ReactComponent as ProfileIcon } from "./assets/profile.svg";
import { ReactComponent as LogoutIcon } from "./assets/logout.svg";
import { ReactComponent as PowerIcon } from "./assets/power.svg";
import useLogout from "../../hooks/useLogout";
import style from "./user-menu.module.scss";
import { SideBarModalMode, SideBarModalOpen } from "../../types/sidebar-modal";
import SVGPath from "./icons.svg";

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

	const ITEMS = [
		{
			action: () => {
				openModal(SideBarModalMode.Account);
				onRequestClose();
			},
			icon: ProfileIcon,
			text: "My Account",
		},
		{
			action: () => {
				openModal(SideBarModalMode.Restart);
				onRequestClose();
			},
			icon: PowerIcon,
			text: "Restart Server",
		},
		{
			action: logout,
			icon: LogoutIcon,
			text: "Log Out",
		},
	];

	return (
		<Dialog
			open={open}
			onRequestClose={onRequestClose}
			modal={false}
			variant="user"
			closeOnOutsideClick
			wrapperClass={style.wrapper}
			id="user-menu"
			style={{
				display: "grid",
				width: "100%",
				gridAutoRows: "44px",
			}}
		>
			{ITEMS.map((item) => (
				<button
					className={style.button}
					onClick={item.action}
					key={item.text}
					type="button"
				>
					<item.icon aria-hidden width={17} height={16} fill="currentColor" />
					{item.text}
				</button>
			))}
		</Dialog>
	);
}
