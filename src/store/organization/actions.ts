import {Organization} from "../../types/organization/types"

export const fetchOrganizations = (organizations: Organization[]) => ({
    type: 'ADD_ORGS',
    payload: {organizations: organizations},
});
