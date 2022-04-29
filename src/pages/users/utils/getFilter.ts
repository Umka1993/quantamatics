import { UserWithRoles } from "../../../types/user";

export default function getFilter(query: string) {
	return ({
		firstName,
		lastName,
		userName,
		subscriptionEndDate,
		roles,
	}: UserWithRoles) =>
		firstName.toLocaleLowerCase().includes(query) ||
		lastName.toLocaleLowerCase().includes(query) ||
		userName.toLocaleLowerCase().includes(query) ||
		subscriptionEndDate.toLocaleLowerCase().includes(query) ||
		roles.findIndex((role) => role.toLocaleLowerCase().includes(query)) >
			-1;
}
