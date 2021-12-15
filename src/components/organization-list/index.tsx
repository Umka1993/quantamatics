import React, { ReactElement } from "react";
import style from "./organization-list.module.scss";
import AddIcon from "./assets/add.svg";
import { OrganizationTable } from "../table/OrganizationTable";
import Button from "../button";
import Headline from "../page-title/index";
import { AppRoute } from "../../data/enum";

export default function OrganizationList(): ReactElement {
    return (
        <div className={style.root}>
            <header className={style.header}>
                <div className={style.titles}>
                    <Headline>Organizations</Headline>
                    <p>Create and manage organizations and user accounts</p>
                </div>

                <Button className={style.button} href={AppRoute.CreateOrganization}>
                    <AddIcon aria-hidden="true" />
                    Add New
                </Button>
            </header>
            <OrganizationTable />
        </div>
    );
}
