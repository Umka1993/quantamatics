import { OrganizationKey } from "../../data/enum";
export interface Organization {
    [ OrganizationKey.Id ]: string,
    [ OrganizationKey.Parent ]: string,
    [ OrganizationKey.Name ]: string,
    [ OrganizationKey.IdCRM ]: string,
    [ OrganizationKey.LinkCRM ]: string,
    [ OrganizationKey.Comment ]: string,
    [ OrganizationKey.Assets ]: any,
}
