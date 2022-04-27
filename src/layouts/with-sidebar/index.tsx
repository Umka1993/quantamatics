import { useEffect, ReactElement, useState } from "react";
import { getCookie } from "../../services/cookies";
import useLogout from "../../hooks/useLogout";
import { SideBar } from "../../components/side-bar";
import style from "./with-sidebar.module.scss";
import PrivateRoutes from "../../router/private-routes";
import MyAccountModal from "../../components/my-account-modal/MyAccountModal";
import { RestartServer } from "../../components/restart-server";

import { useLocation } from "react-router-dom";
import useUser from "../../hooks/useUser";
import { useGetUserQuery } from "../../api/user";
import { useDispatch } from "react-redux";
import { login } from "../../store/authorization";
import { useCallback } from "react";
import { SideBarModalModeType } from "../../types/sidebar-modal";
import UserMenu from "../../components/user-menu";
import useBoolean from "../../hooks/useBoolean";

export default function WithSideBarLayout(): ReactElement {
	const logout = useLogout();
	const { pathname } = useLocation();

	const { id, userRoles } = useUser();
	const { data: user, isSuccess: isUserLoaded } = useGetUserQuery(id);
	const dispatch = useDispatch();

	const [activeModal, setActiveModal] =
		useState<SideBarModalModeType>(undefined);

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

	const {
		value: isUserMenuOpened,
		setTrue: openUserMenu,
		setFalse: closeUserMenu,
	} = useBoolean(false);

	return (
		<>
			<SideBar toggleUserMenu={openUserMenu} />
			<main className={style.main}>
				<PrivateRoutes />
			</main>
			<UserMenu
				open={isUserMenuOpened}
				onRequestClose={closeUserMenu}
				openModal={setActiveModal}
			/>
			<RestartServer
				open={isRestartServerModalShowed}
				onRequestClose={closeModal}
			/>
			<MyAccountModal open={isProfileModalShowed} onRequestClose={closeModal} />
		</>
	);
}
