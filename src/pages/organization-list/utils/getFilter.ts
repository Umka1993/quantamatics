import { Organization } from "../../../types/organization/types";

export default function getFilter(query: string) {
	return ({ name, customerCrmId, customerCrmLink, comments }: Organization) =>
		Boolean(
			name.toLocaleLowerCase().includes(query) ||
				customerCrmLink.toLocaleLowerCase().includes(query) ||
				customerCrmId.toLocaleLowerCase().includes(query) ||
				(comments && comments.toLocaleLowerCase().includes(query))
		);
}
