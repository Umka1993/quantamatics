import React, { ReactElement, useState } from "react";
import style from "./organization-list.module.scss";
import AddIcon from "./assets/add.svg";
import { OrganizationTable } from "../table/OrganizationTable";
import Button from "../button";
import Headline from "../page-title/index";
import { AppRoute } from "../../data/enum";
import SearchField from "../search-field/SearchField";

export default function OrganizationList(): ReactElement {
	const [search, setSearch] = useState('')
	return (
		<div className={style.root}>
			<header className={style.header}>
				<Headline>Organizations</Headline>
				<SearchField search={search} setSearch={setSearch} />

				<Button className={style.button} href={AppRoute.CreateOrganization}>
					<AddIcon aria-hidden="true" />
	Add New
				</Button>
			</header>
			<OrganizationTable search={search} />
		</div>
	);
}
