import { SortDirection } from "../../data/enum";
import { Dispatch, SetStateAction, ThHTMLAttributes, useEffect } from "react";
import sortTable, { changeSortDirection } from "./utils/sort";
import { ReactComponent as SortIcon } from "./assets/sort-icon.svg";
import s from "./SortTableHeader.module.scss";
import { ReactComponent as DownArrow } from "./assets/down.svg";
import classNames from "classnames";
import ISort from "../../types/sort-type";

type Props<Row> = ThHTMLAttributes<HTMLTableHeaderCellElement> & {
	isActive?: boolean;
	name: string;
	direction: SortDirection;
	setSort: Dispatch<SetStateAction<ISort>>;
	rowSetter: Dispatch<SetStateAction<Row[]>>;
	localKey?: string;
};

export default function SortTableHeader<Row>({
	className,
	children,
	isActive,
	name,
	direction,
	setSort,
	localKey = "table-rows",
	rowSetter,
	...other
}: Props<Row>) {
	const isDefault = direction === SortDirection.Default;

	useEffect(() => {
		if (isActive) {
			// console.info(localKey, direction)
			sortTable(direction, name, rowSetter, localKey);
		}
	}, [isActive, direction]);

	function updateSort() {
		setSort({ name, direction: changeSortDirection(direction) });
	}

	return (
		<th
			className={classNames(s.root, className)}
			aria-sort={isActive ? direction : SortDirection.Default}
			{...other}
		>
			<button onClick={updateSort} type="button" className={s.button}>
				{children}

				{isActive && !isDefault ? (
					<DownArrow
						aria-hidden
						className={classNames(s.arrow, {
							[s["arrow--up"]]: direction === SortDirection.Up,
						})}
					/>
				) : (
					<SortIcon aria-hidden className={s.arrow} />
				)}
			</button>
		</th>
	);
}
