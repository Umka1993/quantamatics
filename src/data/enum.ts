export const enum AppInfo {
    Name = 'Quantamatics',
}

export const enum AppRoute {
    Home = '/',
    Files = '/research/my-files',
    Shared = '/research/shared-with-me',
    Favorites = '/research/favorites',
    AddUser = '/add-user',
    Coherence = '/coherence',
    ExcelLibrary = '/excel-library',
    Settings = '/settings',

    Organizations = '/apps/organizations/:path',
    OrganizationList = '/apps/organizations/list',
    CreateOrganization = '/apps/organizations/new-organization',
    SignUp = '/sign-up',
    ResetPassword = '/reset-password',
    Login = '/login',
    ForgotPassword = '/forgot-password',

    Success = '/success',
    Expired = '/expired',
    ExpiredPassword = '/expired-token',
    SignUpExpired = '/expired-registration',
    NoRoles = '/account-setting-up'
}

export const enum ApiRoute {
    Login = '/api/Account/login',

    ResetPasswordMail = '/api/Account/sendPasswordReset',
    ResetPassword = "/api/Account/resetPassword",


    OrganizationInfo = 'api/Organization/get',
    OrganizationCreate = 'api/Organization/create',
    OrganizationDelete = 'api/Organization/delete',
    OrganizationUpdate = 'api/Organization/update',
    GetAllOrganization = 'api/Organization/getAll',

    GetUsersByOrgID = 'api/User/list',
    GetUserByID = '/api/User/getUser',
    

    RegisterUser = '/api/Account/register',

    UpdateUser = '/api/Admin/updateUser',
    EditRoles = '/api/Admin/editRoles/',

}

export const enum AuthorizationStatus {
    Auth = 'AUTH',
    NoAuth = 'NO_AUTH',
    Unknown = 'UNKNOWN',
}

export const enum UserRole {
    Admin = "Admin",
    OrgOwner = 'OrgOwner',
    OrgAdmin = "OrgAdmin",
    Research = "Research",
    Coherence = "Coherence",
}


export const enum OrganizationKey {
    Id = 'id',
    Parent = 'parentId',
    Name = 'name',
    IdCRM = 'customerCrmId',
    LinkCRM = 'customerCrmLink',
    Comment = 'comments',
    Assets = 'organizationAssets',
}

export const enum UserKey {
    Id = 'id',
    Email = 'email',
    Name = 'firstName',
    Surname = 'lastName',
    Company = 'companyName',
    CompanyRole = 'companyRole',
    Location = 'location',
    SubscriptionType = 'subscriptionType',
    SubscriptionEndDate = 'subscriptionEndDate',
    ReportPanel = 'reportPanel',
    Expiration = 'expirationDate',
    Avatar = 'avatar',
    UserRoles = 'userRoles',
    OrganizationId = 'organizationId',
}

export const enum SortDirection {
    Down = "descending",
    Up = "ascending",
    Default = "none",
}

export const enum RegExpValidation {
    Password = "^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*\\[\\]\\\\\"';:<_>., =+/-]).*$",
    Email = "[a-zA-Z0-9.!#$%&’*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\\.[a-zA-Z0-9-]+)*$",
    URL = '(https?:\\/\\/(?:www\\.|(?!www))[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\\.[^\\s]{2,}|www\\.[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\\.[^\\s]{2,}|https?:\\/\\/(?:www\\.|(?!www))[a-zA-Z0-9]+\\.[^\\s]{2,}|www\\.[a-zA-Z0-9]+\\.[^\\s]{2,})\r\n'
}

export const enum Error {
    DuplicateUser = 'A user account with this email already exists'
}

export const enum UniqueError {
    Name = "Organization Name must be unique",
    ID = "Organization CRM Customer ID must be unique",
}