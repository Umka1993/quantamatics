import { OrganizationKey, UserKey } from "../../../data/enum";

export const USER_HEADER = {
    titles: ["Name", "Surname", "Email Address", "Expiration Date", "Organization Role"],
    keys: [UserKey.Name, UserKey.Surname, UserKey.Email, UserKey.SubscriptionEndDate, UserKey.UserRoles]
}

export const ORG_HEADER = {
    titles: ["Organization Name", "CRM Customer ID", "CRM Customer link", "Comments"],
    keys: [OrganizationKey.Name, OrganizationKey.IdCRM, OrganizationKey.LinkCRM, OrganizationKey.Comment]
}

