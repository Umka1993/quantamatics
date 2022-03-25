import { SortDirection } from "../../../data/enum";
import { Organization } from "../../../types/organization/types";
import { IUser } from "../../../types/user";
import { AssetInOrganization } from "../../../types/asset";

interface ISort {
	name: string;
	direction: string;
}

interface ISortTable {
	name: string;
	sort: ISort;
	localRows: AssetInOrganization[] | Organization[] | IUser[];
	setSort: (arg: ISort) => void;
	setLocalRows: (arg: AssetInOrganization[] | Organization[] | IUser[]) => void;
	localKey: string;
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
			sessionStorage.setItem(localKey, JSON.stringify(localRows));
			newSort.direction = SortDirection.Up;
			break;
		}
	} else {
		newSort.direction = SortDirection.Up;
	}

	setSort(newSort);

	let newRows = [...localRows];

	switch (newSort.direction) {
	case SortDirection.Up:
		newRows.sort((item) => {
			const first = normalizeCompare({ item,name });
			const second = normalizeCompare({ item, name });

			return first > second ? 1 : second > first ? -1 : 0;
		});
		break;

	case SortDirection.Down:
		newRows.sort((item) => {
			const first = normalizeCompare({ item,name });
			const second = normalizeCompare({ item, name });

			return second > first ? 1 : first > second ? -1 : 0;
		});
		break;

	default:
		{
			const rowsFromStorage = sessionStorage.getItem(localKey);
			if (rowsFromStorage) {
				newRows = JSON.parse(rowsFromStorage);
			} else {
				newRows = [...localRows];
			}
		}
		break;
	}

	setLocalRows(newRows as AssetInOrganization[] | Organization[] | IUser[]);
};


interface INormalizeCompare {
		item:  AssetInOrganization | Organization | IUser
		name: string
}
function normalizeCompare({ item, name }:INormalizeCompare) {

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
