
import { useEffect } from "react";
import { getCookie } from "../../services/cookies";
import { logoutFromJupiter } from "../../services/logoutFromJupiter";
import style from "./unlogged.module.scss";
import Logo from "../../components/logo";
import UnLoggedRoutes from "../../router/unlogged-routes";
import { Route, Routes } from "react-router-dom";
import { AppRoute } from "../../data/enum";
import LoginPage from "../../pages/login/LoginPage";

export default function UnLoggedLayout() {
	useEffect(() => {
		getCookie("user") && logoutFromJupiter();
	}, [document.cookie]);

	return (
		<Routes>
			<Route path="*" element={
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
			} />

			<Route path={AppRoute.Login} element={<LoginPage />} />

		</Routes>
	);
}
