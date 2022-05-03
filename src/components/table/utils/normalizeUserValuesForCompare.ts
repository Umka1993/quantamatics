import { IUser } from "../../../types/user";

export default function normalizeUserValuesForCompare(
	item: string,
	key: keyof IUser
) {
	switch (key) {
	case "subscriptionEndDate":
		return new Date(item);

	case "userRoles":
		return item;
	default:
		return typeof item === "string" && item.toUpperCase();
	}
}
