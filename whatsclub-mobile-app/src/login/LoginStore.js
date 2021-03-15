import {makeAutoObservable} from "mobx";

class LoginStore {
    currentUser = undefined;

    constructor() {
        makeAutoObservable(this)
    }

    get isLoggedIn() {
        return !!this.currentUser;
    }

    async login(username, password) {
        return {
            username: "some@mail.com"
        }
    }
}

export default LoginStore;