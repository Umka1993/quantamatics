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
    Settings = '/settings',

    Organizations = '/apps/organizations/:path',
    SignUp = '/sign-up',
    ResetPassword = '/reset-password',
    Login = '/login',
    ForgotPassword = '/forgot-password',

    Success = '/success-:success'
}

export const enum ApiRoute {
    Base = 'https://qmc-api.k8s.dev.quantamatics.net',

    Login = '/api/Account/login',

    ResetPasswordMail = 'api/Account/sendPasswordReset',
    ResetPassword = "/api/Account/resetPassword",
    ChangePassword = '/api/Account/changePassword',

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