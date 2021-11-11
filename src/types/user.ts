export interface IUser {
    id: number,
    email: string,
    firstName: string,
    lastName: string,
    companyName: string,
    companyRole: string,
    location: string,
    subscriptionType: number,
    subscriptionEndDate: string,
    reportPanel: any,
    expirationDate: string,
    avatar: string,
    userRoles: Array<string>,
    organizationId: string,
}

export interface IUpdateUser extends Omit<IUser, "subscriptionEndDate">  {
    newEmail?: string,
    subscriptionEndDate: Date,
}