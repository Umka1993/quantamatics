import { SortDirection } from "../../data/enum";
import React, {
	Dispatch,
	FunctionComponent,
	SetStateAction,
} from "react";
import sortTable from "./utils/sort";
import { ReactComponent as SortIcon } from "./assets/sort-icon.svg";
import s from "./SortTableHeader.module.scss";
import { ReactComponent as DownArrow } from "./assets/down.svg";
import classNames from "classnames";

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
	localKey = "table-rows",
}) => {
	const isActiveSort = sort.name === name;

	return (
		<th
			className={classNames(s.root, className)}
			aria-sort={isActiveSort ? sort.direction : SortDirection.Default}
		>
			<button
				onClick={() => {
					if (rememberScroll) {
						const scrollWrapper = document.querySelector("main");
						scrollWrapper && rememberScroll(scrollWrapper.scrollTop);
					}
					sortTable(name, sort, localRows, setSort, setLocalRows, localKey);
				}}
				type="button"
				className={s.button}
			>
				{text}

				{isActiveSort && sort.direction !== SortDirection.Default ? (
					<DownArrow
						aria-hidden
						className={classNames(s.arrow, {
							[s["arrow--up"]]: sort.direction === SortDirection.Up,
						})}
					/>
				) : (
					<SortIcon aria-hidden className={s.arrow} />
				)}
			</button>
		</th>
	);
};
