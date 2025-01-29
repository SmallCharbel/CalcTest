// auth.js
class AuthService {
    constructor() {
        this.msalConfig = {
            auth: {
                clientId: "63576da9-88bf-46f2-adea-326796514979",
                authority: "https://login.microsoftonline.com/a05d37d6-5a0d-4083-887d-6b340796809a",
                redirectUri: window.location.origin + window.location.pathname,
            },
            cache: {
                cacheLocation: "sessionStorage",
                storeAuthStateInCookie: false
            }
        };

        this.msalInstance = new msal.PublicClientApplication(this.msalConfig);
    }

    async checkAuth() {
        try {
            const currentAccounts = this.msalInstance.getAllAccounts();
            if (currentAccounts.length > 0) {
                return true;
            }
            return false;
        } catch (error) {
            console.error("Auth check failed:", error);
            return false;
        }
    }

    async login() {
        try {
            const loginRequest = {
                scopes: ["User.Read"]
            };
            await this.msalInstance.loginRedirect(loginRequest);
        } catch (error) {
            console.error("Login failed:", error);
            throw error;
        }
    }

    async logout() {
        try {
            const logoutRequest = {
                account: this.msalInstance.getAllAccounts()[0]
            };
            await this.msalInstance.logoutRedirect(logoutRequest);
        } catch (error) {
            console.error("Logout failed:", error);
            throw error;
        }
    }

    getUser() {
        const currentAccounts = this.msalInstance.getAllAccounts();
        if (currentAccounts.length > 0) {
            return currentAccounts[0];
        }
        return null;
    }
}

window.AuthService = AuthService;
