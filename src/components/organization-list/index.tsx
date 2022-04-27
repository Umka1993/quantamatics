import {
	ReactElement,
	useCallback,
	useDeferredValue,
	useEffect,
	useState,
} from "react";
import style from "./organization-list.module.scss";
import { OrganizationTable } from "../table/OrganizationTable";
import Button from "../button";
import Headline from "../page-title/index";
import { AppRoute } from "../../data/enum";
import SearchField from "../search-field/SearchField";
import SpriteIcon from "../sprite-icon/SpriteIcon";
import useUser from "../../hooks/useUser";
import { useGetAllOrganizationsQuery } from "../../api/organization";
import { Organization } from "../../types/organization/types";
import Loader from "../loader";

export default function OrganizationList(): ReactElement {
	const [search, setSearch] = useState("");

	const deferredSearch = useDeferredValue(search);

	const user = useUser();

	const {
		data: organizations,
		isError,
		isSuccess,
	} = useGetAllOrganizationsQuery(user?.id as number);

	const [localRows, setLocalRows] = useState<Organization[]>([]);

	const filterOrganizationsToQuery = useCallback(
		(query: string) => {
			const normalizedSearchQuery = query.toLocaleLowerCase();
			return (organizations as Organization[]).filter(
				({ name, customerCrmId, customerCrmLink, comments }) =>
					name.toLocaleLowerCase().includes(normalizedSearchQuery) ||
					customerCrmLink.toLocaleLowerCase().includes(normalizedSearchQuery) ||
					customerCrmId.toLocaleLowerCase().includes(normalizedSearchQuery) ||
					(comments &&
						comments.toLocaleLowerCase().includes(normalizedSearchQuery))
			);
		},
		[organizations]
	);

	const listIsReady = localRows && isSuccess;

	useEffect(() => {
		if (organizations) {
			const filtered = deferredSearch.length
				? filterOrganizationsToQuery(deferredSearch)
				: organizations;
			setLocalRows(filtered);
			sessionStorage.setItem("table-rows", JSON.stringify(filtered));
		}
	}, [deferredSearch, organizations]);

	return (
		<>
			<header
				className={style.header}
				onInput={(evt) => console.log(evt.target)}
			>
				<Headline>Organizations</Headline>
				<SearchField search={search} setSearch={setSearch} />
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
				(localRows.length ? (
					<OrganizationTable list={localRows} setter={setLocalRows} />
				) : deferredSearch.length ? (
					<samp className={style.output}>
						No results for “
						{deferredSearch.length > 32 ? `${search.slice(0, 32)}…` : search}”
						were found.
					</samp>
				) : (
					<samp className={style.output}>No organizations found</samp>
				))}
		</>
	);
}
