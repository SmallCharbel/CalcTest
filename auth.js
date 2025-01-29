// auth.js
class AuthHandler {
    constructor() {
        this.isAuthenticated = localStorage.getItem('testAuth') === 'true';
    }

    login() {
        localStorage.setItem('testAuth', 'true');
        this.isAuthenticated = true;
        window.location.href = 'index.html';
    }

    logout() {
        localStorage.setItem('testAuth', 'false');
        this.isAuthenticated = false;
        window.location.href = 'login.html';
    }

    isLoggedIn() {
        return this.isAuthenticated;
    }

    getActiveAccount() {
        return { username: 'Test User' };
    }
}

window.AuthHandler = AuthHandler;
