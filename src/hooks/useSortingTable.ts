import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { SortDirection } from "../data/enum";

interface Props<Row, Element> {
	initialSort?: string;
	initialDirection?: SortDirection;
	availableDirections?: SortDirection[];
	rowSetter: Dispatch<SetStateAction<Row[]>>;
	localKey?: string;
}

export default function useSortingTable<Row, Element = string>({
	initialSort = "",
	initialDirection = SortDirection.Default,
	availableDirections = [
		SortDirection.Default,
		SortDirection.Up,
		SortDirection.Down,
	],
	rowSetter,
	localKey = "table-rows",
}: Props<Row, Element>) {
	const [activeSort, setActiveSort] = useState(initialSort);
	const [activeDirection, setActiveDirection] = useState(initialDirection);

	function updateSort(name?: string) {
		const currentIndex =
			availableDirections.findIndex(
				(direction) => direction === activeDirection
			) + 1;
		const nextIndex =
			currentIndex === availableDirections.length ? 0 : currentIndex;
		setActiveDirection(availableDirections[nextIndex]);

		name && setActiveSort(name);
	}

	useEffect(() => {
		if (activeSort.length) {
			// console.log(activeSort, activeDirection);

			sortTable(activeDirection, activeSort, rowSetter, localKey);
		}
	}, [activeSort, activeDirection]);

	return { activeSort, activeDirection, updateSort };
}

function sortTable<Row>(
	direction: SortDirection,
	name: string,
	setLocalRows: Dispatch<SetStateAction<Row[]>>,
	localKey: string
) {
	setLocalRows((oldRows) => {
		let newRows = [...oldRows];

		switch (direction) {
		case SortDirection.Up:
			newRows.sort((a, b) => {
				const first = normalizeCompare(a, name);
				const second = normalizeCompare(b, name);

				return first > second ? 1 : second > first ? -1 : 0;
			});
			break;

		case SortDirection.Down:
			newRows.reverse();
			break;

		default:
			{
				const rowsFromStorage = sessionStorage.getItem(localKey as string);
				if (rowsFromStorage) {
					newRows = JSON.parse(rowsFromStorage) as Row[];
				}
			}
			break;
		}

		return newRows;
	});
}

function normalizeCompare(item: any, name: string) {

	switch (name) {
	case "subscriptionEndDate":
		return new Date(item[name]);

	case "userRoles":
		return item[name];

	case "name":
		if ("asset" in item && item.asset) {
			return item.asset[name];
		} else {
			return item[name].toUpperCase();
		}

	default:
		return item[name].toUpperCase();
	}
}
