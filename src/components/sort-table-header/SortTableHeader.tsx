import React from "react";
import { SortDirection, sortTable } from "../../services/baseService";
import SortIcon from './assets/sort-icon.svg';
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

export const SortTableHeader: React.FunctionComponent<ISortTableHeader> = ({name, sort, localRows, setSort, setLocalRows, text, className}) => {
    return (
        <button
            className={["table-head-item", className].join(' ')}
            onClick={() =>
                sortTable(name, sort, localRows, setSort, setLocalRows)
            }
            aria-sort={
                sort.name === name
                    ? sort.direction
                    : SortDirection.Default
            }
        >
            {text}
            <SortIcon aria-hidden/>
        </button>
    );
};
