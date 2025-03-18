export class Auth {
    constructor() {
        this.users = JSON.parse(localStorage.getItem('users')) || [];
    }

    login(email, password) {
        const user = this.users.find(u => u.email === email && u.password === password);
        if (user) {
            localStorage.setItem('isLoggedIn', 'true');
            localStorage.setItem('currentUser', JSON.stringify(user));
            return true;
        }
        return false;
    }

    register(userData) {
        this.users.push(userData);
        localStorage.setItem('users', JSON.stringify(this.users));
        return true;
    }

    isLoggedIn() {
        return localStorage.getItem('isLoggedIn') === 'true';
    }

    logout() {
        localStorage.removeItem('isLoggedIn');
        localStorage.removeItem('currentUser');
    }
}
