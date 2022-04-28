import { FetchBaseQueryMeta } from "@reduxjs/toolkit/dist/query";
import { UserKey } from "../data/enum";
import { Organization } from "../types/organization/types";
import { IUser } from "../types/user";

export type GetOrganizationProps = Pick<IUser, UserKey.Id | UserKey.OrganizationId> & {
	isSuperAdmin: boolean;
};

export default function filterOrganizationsToUserRole(
	allOrganizations: Organization[],
	_meta: FetchBaseQueryMeta | undefined,
	{ isSuperAdmin, organizationId }: GetOrganizationProps
) {
	return isSuperAdmin
		? allOrganizations
		: allOrganizations.filter(checkIsUserOrganization);

	function checkIsUserOrganization(organization: Organization) {
		return organization.parentId === String(organizationId);
	}
}
