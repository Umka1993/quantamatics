import { UserWithRoles } from "../../../types/user";

export default function normalizeUserValuesForCompare(
	item: string,
	key: keyof UserWithRoles
) {
	switch (key) {
	case "subscriptionEndDate":
		return new Date(item.split(" ")[0]);

	case "roles":
		return item;

	case "companyName":
		return item === null ? "" : item
	default:
		return typeof item === "string" && item.toUpperCase();
	}
}
