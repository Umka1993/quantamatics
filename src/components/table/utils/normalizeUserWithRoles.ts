import { UserWithRoles } from "../../../types/user";

export default function normalizeUserValuesForCompare(
	item: string,
	key: keyof UserWithRoles
) {
	switch (key) {
	case "subscriptionEndDate":
		return new Date(item);

	case "roles":
		return item;
	default:
		return typeof item === "string" && item.toUpperCase();
	}
}
