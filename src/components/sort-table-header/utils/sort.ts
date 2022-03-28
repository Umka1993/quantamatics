import { SortDirection } from "../../../data/enum";
import { Organization } from "../../../types/organization/types";
import { IUser } from "../../../types/user";
import { AssetInOrganization } from "../../../types/asset";
import { Dispatch } from "@reduxjs/toolkit";

interface ISort {
	name: string;
	direction: "none" | "ascending" | "descending" | "other" | undefined;
}

export interface ISortTable {
	name: string;
	sort: ISort;
	localRows: AssetInOrganization[] | Organization[] | IUser[];
	setSort: (arg: Dispatch<any>) => void;
	setLocalRows: (arg: Dispatch<any>) => void;
	localKey?: string;
}

const sortTable = ({
	name,
	sort,
	localRows,
	setSort,
	setLocalRows,
	localKey,
}: ISortTable): void => {
	const newSort = { ...sort, name };

	if (name === sort.name || "" === sort.name) {
		switch (sort.direction) {
		case SortDirection.Up:
			newSort.direction = SortDirection.Down;
			break;
		case SortDirection.Down:
			newSort.direction = SortDirection.Default;
			break;

		default:
			sessionStorage.setItem(localKey as string, JSON.stringify(localRows));
			newSort.direction = SortDirection.Up;
			break;
		}
	} else {
		newSort.direction = SortDirection.Up;
	}

	setSort(newSort as unknown as Dispatch<any>);

	let newRows = [...localRows];

	switch (newSort.direction) {
	case SortDirection.Up:
		newRows.sort((a, b) => {
			const first = normalizeCompare(a, name);
			const second = normalizeCompare(b, name);

			return first > second ? 1 : second > first ? -1 : 0;
		});
		break;

	case SortDirection.Down:
		newRows.sort((a, b) => {
			const first = normalizeCompare(a, name);
			const second = normalizeCompare(b, name);

			return second > first ? 1 : first > second ? -1 : 0;
		});
		break;

	default:
		{
			const rowsFromStorage = sessionStorage.getItem(localKey as string);
			if (rowsFromStorage) {
				newRows = JSON.parse(rowsFromStorage);
			} else {
				newRows = [...localRows];
			}
		}
		break;
	}

	setLocalRows(newRows as unknown as Dispatch<any>);
};

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
