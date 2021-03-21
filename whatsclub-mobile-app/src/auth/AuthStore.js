import {makeAutoObservable, runInAction} from "mobx";
import ApiClient from "../api/ApiClient";
import {StorageService} from "../storage/StorageService";

const AUTH_STORAGE_KEY = "auth";

class AuthStore {
    loaded = false
    user = undefined;
    accessToken = undefined;
    loginSessionToken = undefined;

    constructor(apiClient: ApiClient, storage: StorageService) {
        makeAutoObservable(this, {client: false, storage: false});
        this.client = apiClient;
        this.storage = storage;
    }

    async load() {
        const auth = await this.storage.get(AUTH_STORAGE_KEY);
        if (auth) {
            runInAction(() => {
                this.user = auth.user;
                this.accessToken = auth.accessToken;
            })
        }
        runInAction(() => {
            this.loaded = true;
        })
    }

    get isLoaded() {
        return !!this.loaded;
    }

    get isLoggedIn() {
        return !!this.user;
    }

    fakeLogin() {
        this.user = {username: "fake_user"}
    }

    async mfaLoginPassword(username, password) {
        try {
            const {loginSessionToken} = await this.client.postPublic("/login/password", {
                username,
                password
            });
            runInAction(() => {
                this.loginSessionToken = loginSessionToken;
            })
            return {status: "ok", loginSessionToken};
        } catch (e) {
            if (e.errorCode === "IUOP01") {
                return {status: "invalid"}
            }
            throw e;
        }
    }

    async mfaLoginOtp(otp) {
        if (!this.loginSessionToken) {
            throw  Error("Invalid state exception, retrieve loginSessionToken first.");
        }
        try {
            const {accessToken} = await this.client.post("/login/mfa/phone-otp", this.loginSessionToken, {otp});
            const user = await this.client.get("/users/me", accessToken);
            await this.storage.set(AUTH_STORAGE_KEY, {user, accessToken});
            runInAction(() => {
                this.accessToken = accessToken;
                this.user = user;
                this.loginSessionToken = undefined;
            })
            return this.user;
        } catch (e) {
            if (e.errorCode === "IOTP01") {
                return {status: "invalid"}
            }
            throw e;
        }
    }

    async logout() {
        await this.storage.remove(AUTH_STORAGE_KEY);
        runInAction(() => {
            this.user = undefined;
            this.accessToken = undefined;
        })
    }

}

export default AuthStore;