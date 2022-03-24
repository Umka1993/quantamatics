import { AssetInOrganization } from "../asset";
import { OrganizationKey } from "../../data/enum";

export type OrganizationID = string;
export interface Organization {
	[ OrganizationKey.Id ]: OrganizationID,
	[ OrganizationKey.Parent ]: string | null,
	parentOrganization: string
	[ OrganizationKey.Name ]: string,
	[ OrganizationKey.IdCRM ]: string,
	[ OrganizationKey.LinkCRM ]: string,
	[ OrganizationKey.Comment ]: string,
	[ OrganizationKey.Assets ]: AssetInOrganization[],
}
