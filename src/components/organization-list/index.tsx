import React, { ReactElement } from "react";
import style from "./organization-list.module.scss";
import AddIcon from "./assets/add.svg";
import { OrganizationTable } from "../table/OrganizationTable";
import Button from "../button";
import Headline from "../page-title/index";
import { AppRoute } from "../../data/enum";
import SearchIcon from "./assets/search.svg";

export default function OrganizationList(): ReactElement {
    return (
        <div className={style.root}>
            <header className={style.header}>
                <Headline>Organizations</Headline>

                <label className={style.search}>
                    <SearchIcon
                        width={16}
                        height={16}
                        role="img"
                        aria-label="Search organization"
                        fill='currentColor'
                    />
                    <input
                        type="search"
                        name="search"
                        placeholder="Search organization..."
                    />
                </label>

                <Button className={style.button} href={AppRoute.CreateOrganization}>
                    <AddIcon aria-hidden="true" />
                    Add New
                </Button>
            </header>
            <OrganizationTable />
        </div>
    );
}
