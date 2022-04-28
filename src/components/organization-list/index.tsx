import { ReactElement, useEffect } from "react";
import style from "./organization-list.module.scss";
import { OrganizationTable } from "../table/OrganizationTable";
import Button from "../button";
import Headline from "../page-title/index";
import { AppRoute, UserRole } from "../../data/enum";
import SearchField, { useFilterToSearchQuery } from "../search-field";
import SpriteIcon from "../sprite-icon/SpriteIcon";
import useUser from "../../hooks/useUser";
import { useGetAllOrganizationsQuery } from "../../api/organization";
import Loader from "../loader";
import getFilter from "./utils/getFilter";

export default function OrganizationList(): ReactElement {
	const { userRoles, organizationId, id } = useUser();
	const isSuperAdmin = userRoles.includes(UserRole.Admin);

	const {
		data: organizations,
		isError,
		isSuccess,
		error,
	} = useGetAllOrganizationsQuery({ id, organizationId, isSuperAdmin });

	const { searchQuery, filteredItems, setFilteredItems, inputHandler } =
		useFilterToSearchQuery(organizations || [], getFilter);

	const listIsReady = filteredItems && isSuccess;

	useEffect(() => {
		isError && console.debug(error);
	}, [error, isError]);

	return (
		<>
			<header className={style.header}>
				<Headline>Organizations</Headline>
				<SearchField onInput={inputHandler} />
				<Button className={style.button} href={AppRoute.CreateOrganization}>
					<SpriteIcon icon="plus" width={10} />
					Create
				</Button>
			</header>

			{!isError && !listIsReady && (
				<div
					style={{
						position: "relative",
						height: "60vh",
					}}
				>
					<Loader />
				</div>
			)}
			{isError && <samp className={style.output}>Something went wrong</samp>}

			{listIsReady &&
				(filteredItems.length ? (
					<OrganizationTable list={filteredItems} setter={setFilteredItems} />
				) : searchQuery.length ? (
					<samp className={style.output}>
						No results for “
						{searchQuery.length > 32
							? `${searchQuery.slice(0, 32)}…`
							: searchQuery}
						” were found.
					</samp>
				) : (
					<samp className={style.output}>No organizations found</samp>
				))}
		</>
	);
}
