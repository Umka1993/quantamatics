import { UserKey, UserRole } from "../data/enum";

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
    [UserKey.OrganizationId]: string,
}

export interface IUpdateUser extends Omit<IUser, UserKey.SubscriptionEndDate>  {
    newEmail?: string,
    [UserKey.SubscriptionEndDate]: Date,
}