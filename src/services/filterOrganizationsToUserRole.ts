import { FetchBaseQueryMeta } from "@reduxjs/toolkit/dist/query";
import { UserKey } from "../data/enum";
import { Organization } from "../types/organization/types";
import { IUser } from "../types/user";

export type GetOrganizationProps = Pick<
	IUser,
	UserKey.Id | UserKey.OrganizationId
> & {
	isSuperAdmin: boolean;
};

export default function filterOrganizationsToUserRole(
	allOrganizations: Organization[],
	_meta: FetchBaseQueryMeta | undefined,
	props: GetOrganizationProps | void
) {
	if (props) {
		const { isSuperAdmin, organizationId } = props;

		const checkIsUserOrganization = (organization: Organization) =>
			organization.parentId === String(organizationId);

		return isSuperAdmin
			? allOrganizations
			: allOrganizations.filter(checkIsUserOrganization);
	} else {
		return allOrganizations;
	}
}
