import { UserRole } from "../data/enum";
import useUser from "../hooks/useUser";
import { Organization } from "../types/organization/types";

export default function filterOrganizationsToUserRole(
	allOrganizations: Organization[]
) {
	const { userRoles, organizationId } = useUser();
	const isSuperAdmin = userRoles.includes(UserRole.Admin);

	return isSuperAdmin
		? allOrganizations
		: allOrganizations.filter(checkIsUserOrganization);

	function checkIsUserOrganization(organization: Organization) {
		return organization.parentId === String(organizationId);
	}
}
