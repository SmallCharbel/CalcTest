// auth.js
class AuthHandler {
    constructor() {
        // Add a flag for test environment
        this.isTestEnvironment = true; // Set this to true for test environment
        
        this.msalConfig = {
            auth: {
                clientId: "63576da9-88bf-46f2-adea-326796514979",
                authority: "https://login.microsoftonline.com/a05d37d6-5a0d-4083-887d-6b340796809a",
                redirectUri: window.location.origin + window.location.pathname.replace('login.html', 'index.html'),
                postLogoutRedirectUri: window.location.origin + window.location.pathname.replace('index.html', 'login.html'),
                navigateToLoginRequestUrl: true
            },
            cache: {
                cacheLocation: "sessionStorage",
                storeAuthStateInCookie: false
            }
        };

        this.loginRequest = {
            scopes: ["User.Read"]
        };

        // Only initialize MSAL if not in test environment
        if (!this.isTestEnvironment) {
            this.msalInstance = new msal.PublicClientApplication(this.msalConfig);
        }
    }

    async initialize() {
        // For test environment, always return true
        if (this.isTestEnvironment) {
            return true;
        }

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
        if (this.isTestEnvironment) {
            // In test environment, just redirect to index
            window.location.href = 'index.html';
            return;
        }

        try {
            await this.msalInstance.loginRedirect(this.loginRequest);
        } catch (error) {
            console.error('Login error:', error);
            throw error;
        }
    }

    async logout() {
        if (this.isTestEnvironment) {
            // In test environment, just redirect to login
            window.location.href = 'login.html';
            return;
        }

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
        if (this.isTestEnvironment) {
            return { username: 'Test User' };
        }
        return this.msalInstance.getActiveAccount();
    }

    // Helper method to check if we're in test mode
    isTestMode() {
        return this.isTestEnvironment;
    }
}

// Export the AuthHandler class
window.AuthHandler = AuthHandler;
