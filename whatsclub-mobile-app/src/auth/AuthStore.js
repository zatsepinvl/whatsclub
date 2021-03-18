import {makeAutoObservable} from "mobx";
import ApiClient from "../api/ApiClient";


class AuthStore {
    user = undefined;
    accessToken = undefined;

    constructor(rootStore, apiClient: ApiClient) {
        makeAutoObservable(this);
        this.client = apiClient;
    }

    get isLoggedIn() {
        return !!this.user;
    }

    async login(username, password) {
        const {loginSessionToken} = await this.client.post("/login/password", {
            "username": "user@mail.com",
            "password": "password"
        });
        console.log("loginSessionToken", loginSessionToken);
        const {accessToken} = await this.client.post("/login/mfa/phone-otp",
            {
                "otp": "4332"
            }, loginSessionToken);
        console.log("accessToken", accessToken);
        this.accessToken = accessToken;
        this.user = await this.client.get("/users/me", accessToken);
        return this.user;
    }
}

export default AuthStore;