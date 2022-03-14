import { SortDirection } from "../../../data/enum";

const sortTable = (
	name: string,
	sort: any,
	localRows: any,
	setSort: any,
	setLocalRows: any,
	localKey: string
) => {
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
		newRows.sort((a: any, b: any) => {
			const first = normalizeCompare(a, name);
			const second = normalizeCompare(b, name);

			return first > second ? 1 : second > first ? -1 : 0;
		});
		break;

	case SortDirection.Down:
		newRows.sort((a: any, b: any) => {
			const first = normalizeCompare(a, name);
			const second = normalizeCompare(b, name);

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

	setLocalRows(newRows);
};

function normalizeCompare(item: any, name: string) {
	switch (name) {
	case "subscriptionEndDate":
		return item[name];

	case "userRoles":
		return item[name];

	case "name":
		if (item.asset) {
			return item.asset[name];
		} else {
			return item[name].toUpperCase();
		}

	default:
		return item[name].toUpperCase();
	}
}

export default sortTable;
