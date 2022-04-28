/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from "react";
import { SortDirection } from "../data/enum";
interface Props<Row> {
	initialSort?: keyof Row | "";
	initialDirection?: SortDirection;
	availableDirections?: SortDirection[];
	initialRows: Row[];
	normalizer?: (item: any, key: keyof Row) => any;
}

export default function useSortingTable<Row>({
	initialSort = "",
	initialDirection = SortDirection.Default,
	availableDirections = [
		SortDirection.Default,
		SortDirection.Down,
		SortDirection.Up,
	],
	initialRows,
	normalizer = defaultNormalizer,
}: Props<Row>) {
	const [activeSort, setActiveSort] = useState(initialSort);
	const [activeDirection, setActiveDirection] = useState(initialDirection);
	const [sortedRows, setSortedRows] = useState<Row[]>(initialRows);

	useEffect(() => {
		if ((activeSort as string).length) {
			setSortedRows(sortByDirection);
		}
	}, [activeSort, activeDirection, initialRows]);

	function sortByDirection() {
		switch (activeDirection) {
		case initialDirection:
			return initialRows;
		case SortDirection.Down:
			return sortingDown();

		default:
			return sortingDown().reverse();
		}
	}

	function sortingDown() {
		return [...initialRows].sort((a, b) => {
			const first = normalizer((a as any)[activeSort], activeSort as keyof Row);
			const second = normalizer(
				(b as any)[activeSort],
				activeSort as keyof Row
			);

			return first > second ? 1 : second > first ? -1 : 0;
		});
	}

	function updateSort(name?: keyof Row) {
		const currentIndex =
			availableDirections.findIndex(
				(direction) => direction === activeDirection
			) + 1;
		const nextIndex =
			currentIndex === availableDirections.length ? 0 : currentIndex;
		setActiveDirection(availableDirections[nextIndex]);

		name && setActiveSort(name);
	}

	return { activeSort, activeDirection, updateSort, sortedRows };
}

function defaultNormalizer(value: string) {
	return value.toUpperCase();
}
