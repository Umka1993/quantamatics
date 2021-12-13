export const enum AppInfo {
    Name = 'Quantamatics',
    LogoPath = 'img/logo.svg'
}

export const enum AppRoute {
    Home = '/',
    Files = '/research/my-files',
    Shared = '/research/shared-with-me',
    Favorites = '/research/favorites',
    AddUser = '/add-user',
    Coherence = '/coherence',
    Settings = '/settings',

    Organizations = '/apps/organizations/:path',
    SignUp = '/sign-up',
    ResetPassword = '/reset-password',
    Login = 'login',
    ForgotPassword = '/forgot-password',

    Success = '/success-:success',
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
    Assets = 'assets',
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
    Email = "[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+.[a-zA-Z]{2,}$",
    URL = '(https?:\\/\\/(?:www\\.|(?!www))[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\\.[^\\s]{2,}|www\\.[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\\.[^\\s]{2,}|https?:\\/\\/(?:www\\.|(?!www))[a-zA-Z0-9]+\\.[^\\s]{2,}|www\\.[a-zA-Z0-9]+\\.[^\\s]{2,})\r\n'
}