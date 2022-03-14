import React, { useEffect, ReactElement, useState } from "react";
import { getCookie } from "../../services/cookies";
import useLogout from "../../hooks/useLogout";
import { SideBar } from "../../components/side-bar";
import style from "./with-sidebar.module.scss";
import PrivateRoutes from "../../router/private-routes";
import { EditPassword } from "../../components/edit-modal/edit-password";
import { RestartServer } from "../../components/restart-server";

import { useLocation } from "react-router-dom";
import useUser from "../../hooks/useUser";
import { useGetUserQuery } from "../../api/user";
import { useDispatch } from "react-redux";
import { login } from "../../store/authorization";
import Dialog from "../../components/dialog";
import { useCallback } from "react";
import { SideBarModalMode } from "../../types/sidebar-modal";
import useToggle from "../../hooks/useToggle";
import UserMenu from "../../components/user-menu";
import useBoolean from "hooks/useBoolean";

export default function WithSideBarLayout(): ReactElement {
	const logout = useLogout();
	const { pathname } = useLocation();

	const { id, userRoles } = useUser();
	const { data: user, isSuccess: isUserLoaded } = useGetUserQuery(id);
	const dispatch = useDispatch();

	const [activeModal, setActiveModal] = useState<SideBarModalMode>(undefined);

	useEffect(() => {
		!getCookie("user") && logout();
	}, [pathname]);

	useEffect(() => {
		if (isUserLoaded && user && dispatch) {
			const normalizedUser = { ...user, userRoles };
			localStorage.setItem("user", JSON.stringify(normalizedUser));
			dispatch(login(normalizedUser));
		}
	}, [isUserLoaded, dispatch, userRoles]);

	const isProfileModalShowed = activeModal === "my-account";
	const isRestartServerModalShowed = activeModal === "restart-server";
	const closeModal = useCallback(
		() => setActiveModal(undefined),
		[setActiveModal]
	);

	const [isUserMenuOpened, setUserMenuOpened] = useState(false);

	return (
		<>
			<SideBar toggleUserMenu={() => setUserMenuOpened(true)} />
			<main className={style.main}>
				<PrivateRoutes />
			</main>
			{isUserMenuOpened && (
				<UserMenu
					setOpenDropdown={setUserMenuOpened}
					openDropdown={isUserMenuOpened}
					openModal={setActiveModal}
				/>
			)}
			<Dialog
				open={activeModal !== undefined}
				onRequestClose={closeModal}
				closeOnOutsideClick
				headline={isProfileModalShowed ? "My Account" : "Restart Server"}
				id={activeModal}
				wrapperClass={isProfileModalShowed ? "edit-account" : "restart-server"}
				role={isRestartServerModalShowed ? "alertdialog " : "dialog"}
			>
				{user && isProfileModalShowed && <EditPassword onClose={closeModal} />}
				{isRestartServerModalShowed && <RestartServer onClose={closeModal} />}
			</Dialog>
		</>
	);
}
