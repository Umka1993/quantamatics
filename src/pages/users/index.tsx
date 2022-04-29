import { useMemo } from 'react';
import { useGetOrganizationUsersQuery } from '../../api/user';
import Headline from '../../components/page-title'
import { useFilterToSearchQuery } from '../../components/search-field';
import SearchField from '../../components/search-field/SearchField'
import UserTable from '../../components/table/UserTable';
import useUser from '../../hooks/useUser';
import scss from './users.module.scss'
import getFilter from './utils/getFilter';

export default function UsersPage() {
	const { organizationId } = useUser()
	const { data: users, isSuccess: isUsersLoaded } = useGetOrganizationUsersQuery(organizationId)

	const { searchQuery, filteredItems: filteredUsers, inputHandler } =
		useFilterToSearchQuery(users || [], getFilter);

	const endDates = useMemo(() => {
		if (isUsersLoaded && users) {
			const result = new Map<number, string>();

			users.map((user) => {
				result.set(user.id, user.subscriptionEndDate.split(" ")[0]);
			});
			return result;
		}
	}, [isUsersLoaded, users]);


	return <>
		<div className={scss.header}>
			<Headline className={scss.title}>User Accounts</Headline>
			<SearchField onInput={inputHandler} />
		</div>

		{endDates && <UserTable list={filteredUsers} dates={endDates} />}
	</>
}
