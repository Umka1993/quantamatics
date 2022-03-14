import { SortDirection } from "../../data/enum";
import React, { Dispatch, FunctionComponent, SetStateAction, useEffect } from "react";
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
	rememberScroll?: Dispatch<SetStateAction<number>>;
	localKey?: string;
}

export const SortTableHeader: FunctionComponent<ISortTableHeader> = ({
	name,
	sort,
	localRows,
	setSort,
	setLocalRows,
	text,
	className,
	rememberScroll,
	localKey = 'table-rows',
}) => {

	return (
		<th
			className={["sort-table-header", className].join(" ")}
			aria-sort={sort.name === name ? sort.direction : SortDirection.Default}
		>
			<button
				onClick={() => {
					if (rememberScroll) {
						const scrollWrapper = document.querySelector('main')
						scrollWrapper && rememberScroll(scrollWrapper.scrollTop)
					}
					sortTable(name, sort, localRows, setSort, setLocalRows, localKey)
				}}
				type='button'
				className='sort-table-header__button'
			>
				{text}
				<SortIcon aria-hidden />
			</button>
		</th>
	);
};
