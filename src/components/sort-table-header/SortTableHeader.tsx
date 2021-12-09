import { SortDirection } from "../../data/enum";
import React, { FunctionComponent } from "react";
import sortTable from "./utils/sort";
import SortIcon from "./assets/sort-icon.svg";
import "./styles/sort-th.scss";

interface ISortTableHeader {
    name: string;
    sort: any;
    localRows: any;
    setSort: any;
    setLocalRows: any;
    text: string;
    className?: string;
}

export const SortTableHeader: FunctionComponent<ISortTableHeader> = ({
    name,
    sort,
    localRows,
    setSort,
    setLocalRows,
    text,
    className,
}) => {
    return (
        <th
            className={["sort-table-header", className].join(" ")}
            aria-sort={sort.name === name ? sort.direction : SortDirection.Default}
        >
            <button
                onClick={() => sortTable(name, sort, localRows, setSort, setLocalRows)}
                className='sort-table-header__button'
            >
                {text}
                <SortIcon aria-hidden />
            </button>
        </th>
    );
};
