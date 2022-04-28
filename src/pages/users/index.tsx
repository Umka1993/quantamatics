import { useEffect, useMemo, useState } from 'react';
import { useGetOrganizationUsersQuery } from '../../api/user';
import Headline from '../../components/page-title'
import SearchField from '../../components/search-field/SearchField'
import UserTable from '../../components/table/UserTable';
import useUser from '../../hooks/useUser';
import { IUser } from '../../types/user';
import scss from './users.module.scss'

export default function UsersPage() {
	const { organizationId } = useUser()
	const [search, setSearch] = useState("");

	const { data: users, isSuccess: isUsersLoaded } = useGetOrganizationUsersQuery(organizationId)

	const [localRows, setLocalRows] = useState<IUser[]>([])


	const endDates = useMemo(() => {
		if (isUsersLoaded && users) {
			const result = new Map<number, string>();

			users.map((user) => {
				result.set(user.id, user.subscriptionEndDate.split(" ")[0]);
			});
			return result;
		}
	}, [isUsersLoaded, users]);

	useEffect(() => { isUsersLoaded && setLocalRows(users) }, [isUsersLoaded])

	return <>
		<Headline>User Accounts</Headline>
		<SearchField />

		{endDates && <UserTable list={localRows} setter={setLocalRows} dates={endDates} />}
	</>
}
