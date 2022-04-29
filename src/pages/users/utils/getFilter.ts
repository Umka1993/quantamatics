import { IUser } from "../../../types/user";

export default function getFilter(query: string) {
	return ({
		firstName,
		lastName,
		email,
		subscriptionEndDate,
		userRoles,
	}: IUser) =>
		firstName.toLocaleLowerCase().includes(query) ||
		lastName.toLocaleLowerCase().includes(query) ||
		email.toLocaleLowerCase().includes(query) ||
		subscriptionEndDate.toLocaleLowerCase().includes(query) ||
		userRoles.findIndex((role) => role.toLocaleLowerCase().includes(query)) >
			-1;
}
