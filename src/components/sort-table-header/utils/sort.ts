import { SortDirection } from "../../../data/enum";
import { Dispatch as ReactDispatch, SetStateAction } from "react";

export function changeSortDirection(currentDirection: SortDirection) {
	switch (currentDirection) {
	case SortDirection.Up:
		return SortDirection.Down;

	case SortDirection.Down:
		return SortDirection.Default;

	default:
		return SortDirection.Up;
	}
}

export function sortTable<Row>(direction: SortDirection, name: string, setLocalRows: ReactDispatch<SetStateAction<Row[]>>, localKey: string) {


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
			newRows.reverse()
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
	})
}

function normalizeCompare(item: any, name: string) {
	switch (name) {
	case "subscriptionEndDate":
		return item[name];

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

export default sortTable;
