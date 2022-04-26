import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { SortDirection } from "../data/enum";

interface Props<Row> {
	initialSort?: string;
	initialDirection?: SortDirection;
	availableDirections?: SortDirection[];
	rowSetter: Dispatch<SetStateAction<Row[]>>;
	localKey?: string;
}

export default function useSortingTable<Row>({
	initialSort = "",
	initialDirection = SortDirection.Default,
	availableDirections = [
		SortDirection.Default,
		SortDirection.Down,
		SortDirection.Up
	],
	rowSetter,
	localKey = "table-rows",
}: Props<Row>) {
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
			// console.info(`Sort with ${activeSort} ${activeDirection} for ${localKey}`);

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

		switch (direction) {
		case SortDirection.Down:
			return [...oldRows].sort((a, b) => {
				const first = normalizeCompare(a, name);
				const second = normalizeCompare(b, name);

				return first > second ? 1 : second > first ? -1 : 0;
			});

		case SortDirection.Up:
			return [...oldRows].reverse();

		default:
			{
				const rowsFromStorage = sessionStorage.getItem(localKey as string);
				if (rowsFromStorage) {
					return JSON.parse(rowsFromStorage) as Row[];
				}
			}
			break;
		}

		return oldRows

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
