import { useMemo } from "react";
import { useFetchAllUsersQuery } from "../../api/admin";
import Loader from "../../components/loader";
import Headline from "../../components/page-title";
import { useFilterToSearchQuery } from "../../components/search-field";
import SearchField from "../../components/search-field/SearchField";
import AllUserTable from "../../components/table/AllUserTables";
import scss from "../../sass/modules/list-page.module.scss";

import getFilter from "./utils/getFilter";

export default function UsersPage() {
	const { data: users, isSuccess: isUsersLoaded, isFetching } = useFetchAllUsersQuery();

	const {
		filteredItems: filteredUsers,
		inputHandler,
	} = useFilterToSearchQuery(users || [], getFilter);

	const endDates = useMemo(() => {
		if (isUsersLoaded && users) {
			const result = new Map<number, string>();

			users.map((user) => {
				result.set(user.id, user.subscriptionEndDate.split(" ")[0]);
			});
			return result;
		}
	}, [isUsersLoaded, users]);

	return (
		<>
			<div className={scss.header}>
				<Headline className={scss.title}>User Accounts</Headline>
				<SearchField onInput={inputHandler} />
			</div>

			{isFetching && (
				<div className={scss.loader}>
					<Loader />
				</div>
			)}

			{filteredUsers.length ? (
				endDates && <AllUserTable list={filteredUsers} dates={endDates} />
			) : (
				<samp className={scss.output}>No User found</samp>
			)}
		</>
	);
}
