// auth.js
class AuthHandler {
    constructor() {
        this.msalConfig = {
            auth: {
                clientId: "63576da9-88bf-46f2-adea-326796514979",
                authority: "https://login.microsoftonline.com/a05d37d6-5a0d-4083-887d-6b340796809a",
                redirectUri: window.location.origin + window.location.pathname.replace('login.html', 'index.html'), // Dynamic redirect URL
                postLogoutRedirectUri: window.location.origin + window.location.pathname.replace('index.html', 'login.html'),
                navigateToLoginRequestUrl: true
            },
            cache: {
                cacheLocation: "sessionStorage",
                storeAuthStateInCookie: false
            },
            system: {
                loggerOptions: {
                    loggerCallback: (level, message, containsPii) => {
                        if (containsPii) {
                            return;
                        }
                        switch (level) {
                            case msal.LogLevel.Error:
                                console.error(message);
                                break;
                            case msal.LogLevel.Info:
                                console.info(message);
                                break;
                            case msal.LogLevel.Verbose:
                                console.debug(message);
                                break;
                            case msal.LogLevel.Warning:
                                console.warn(message);
                                break;
                        }
                    }
                }
            }
        };

        this.loginRequest = {
            scopes: ["User.Read"]
        };

        this.msalInstance = new msal.PublicClientApplication(this.msalConfig);
    }

    async initialize() {
        try {
            const response = await this.msalInstance.handleRedirectPromise();
            
            if (response) {
                return true;
            }

            const accounts = this.msalInstance.getAllAccounts();
            if (accounts.length > 0) {
                return true;
            }

            return false;
        } catch (error) {
            console.error('Authentication error:', error);
            return false;
        }
    }

    async login() {
        try {
            await this.msalInstance.loginRedirect(this.loginRequest);
        } catch (error) {
            console.error('Login error:', error);
            throw error;
        }
    }

    async logout() {
        try {
            const logoutRequest = {
                account: this.msalInstance.getActiveAccount(),
                postLogoutRedirectUri: this.msalConfig.auth.postLogoutRedirectUri
            };
            await this.msalInstance.logoutRedirect(logoutRequest);
        } catch (error) {
            console.error('Logout error:', error);
            throw error;
        }
    }

    getActiveAccount() {
        return this.msalInstance.getActiveAccount();
    }
}

// Export the AuthHandler class
window.AuthHandler = AuthHandler;