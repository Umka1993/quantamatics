import { UserKey, UserRole } from "../data/enum";
import { OrganizationID } from "./organization/types";
import { AssetInOrganization } from "./asset";

export interface IUser {
	[UserKey.Id]: number,
	[UserKey.Email]: string,
	[UserKey.Name]: string,
	[UserKey.Surname]: string,
	[UserKey.Company]: string,
	[UserKey.CompanyRole]: string,
	[UserKey.Location]: string,
	[UserKey.SubscriptionType]: number,
	[UserKey.SubscriptionEndDate]: string,
	[UserKey.ReportPanel]: any,
	[UserKey.Expiration]: string,
	[UserKey.Avatar]: string,
	[UserKey.UserRoles]: Array<UserRole>,
	[UserKey.OrganizationId]: OrganizationID,
	[UserKey.OrganizationAssets]: AssetInOrganization[],
	allowResearch: boolean,
	allowExcelLibrary: boolean,
	allowCoherence: boolean,
}

export interface IUpdateUser extends Omit<IUser, UserKey.SubscriptionEndDate>  {
	newEmail?: string,
	[UserKey.SubscriptionEndDate]: Date,
}


export interface UserWithRoles {
	id:                  number;
	userName:            string;
	firstName:           string;
	lastName:            string;
	companyName:         null | string;
	reports:             null;
	subscriptionEndDate: string;
	roles:               UserRole[];
}

