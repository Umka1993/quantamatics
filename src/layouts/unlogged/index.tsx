
import React, { ReactElement, useEffect } from "react";
import { getCookie } from "../../services/cookies";
import { logoutFromJupiter } from "../../services/logoutFromJupiter";
import style from "./unlogged.module.scss";
import Logo from "../../components/logo";
import UnLoggedRoutes from "../../router/unlogged-routes";

export default function UnLoggedLayout(): ReactElement {
	useEffect(() => {
		getCookie("user") && logoutFromJupiter();
	}, [document.cookie]);

	return (
		<>
			<header className={style.header}>
				<Logo
					width={196}
					height={37}
				/>
			</header>
			<main className={style.main}>
				<UnLoggedRoutes />
			</main>
		</>
	);
}
