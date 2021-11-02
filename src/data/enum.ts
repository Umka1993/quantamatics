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

    Success = '/success:success'
}

export const enum ApiRoute {
    Base = 'https://qmc-api.k8s.dev.quantamatics.net',
    Login = '/api/Account/login',
}

export const enum AuthorizationStatus {
    Auth = 'AUTH',
    NoAuth = 'NO_AUTH',
    Unknown = 'UNKNOWN',
}
