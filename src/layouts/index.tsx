import { lazy, ReactElement, Suspense } from "react";
import { useSelector } from "react-redux";
import { RootState } from "../store";

import { AuthorizationStatus } from "../data/enum";
import Loader from "../components/loader";

const UnLoggedLayout = lazy(() => import("./unlogged"));
const WithSideBarLayout = lazy(() => import("./with-sidebar"));

export default function BaseLayout(): ReactElement {
	const currentStatus = useSelector((state: RootState) => state.auth.status);
	return (
		<Suspense fallback={<Loader />}>
			{currentStatus === AuthorizationStatus.Auth ? (
				<WithSideBarLayout />
			) : (
				<UnLoggedLayout />
			)}
		</Suspense>
	);
}
