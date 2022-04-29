import { useEffect } from "react";
import scss from "../../sass/modules/list-page.module.scss";
import OrganizationTable from "../../components/table/OrganizationTable";
import Button from "../../components/button";
import Headline from "../../components/page-title";
import { AppRoute, UserRole } from "../../data/enum";
import SearchField, {
	useFilterToSearchQuery,
} from "../../components/search-field";
import SpriteIcon from "../../components/sprite-icon/SpriteIcon";
import useUser from "../../hooks/useUser";
import { useGetAllOrganizationsQuery } from "../../api/organization";
import Loader from "../../components/loader";
import getFilter from "./utils/getFilter";

export default function OrganizationList() {
	const { userRoles, organizationId, id } = useUser();
	const isSuperAdmin = userRoles.includes(UserRole.Admin);

	const {
		data: organizations,
		isError,
		isFetching,
		isSuccess,
		error,
	} = useGetAllOrganizationsQuery({ id, organizationId, isSuperAdmin });

	const { searchQuery, filteredItems, inputHandler } = useFilterToSearchQuery(
		organizations || [],
		getFilter
	);

	const listIsReady = filteredItems && isSuccess;

	useEffect(() => {
		isError && console.debug(error);
	}, [error, isError]);

	return (
		<>
			<header className={scss.header}>
				<Headline className={scss.title}>Organizations</Headline>
				<SearchField onInput={inputHandler} />
				<Button className={scss.button} href={AppRoute.CreateOrganization}>
					<SpriteIcon icon="plus" width={10} />
					Create
				</Button>
			</header>

			{isFetching && <div className={scss.loader}>
				<Loader />
			</div>}


			{isError && <samp className={scss.output}>Something went wrong</samp>}

			{listIsReady &&
				(filteredItems.length ? (
					<OrganizationTable list={filteredItems} />
				) : searchQuery.length ? (
					<samp className={scss.output}>
						No results for “
						{searchQuery.length > 32
							? `${searchQuery.slice(0, 32)}…`
							: searchQuery}
						” were found.
					</samp>
				) : (
					<samp className={scss.output}>No organizations found</samp>
				))}
		</>
	);
}
