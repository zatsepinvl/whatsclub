import {makeAutoObservable, runInAction} from "mobx";
import ApiClient from "../api/ApiClient";
import {StorageService} from "../storage/StorageService";

const AUTH_STORAGE_KEY = "auth";

class AuthStore {
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
            const {accessToken} = auth;
            const user = await this._loadCurrentUser(accessToken);
            runInAction(() => {
                this.user = user;
                this.accessToken = accessToken;
            })
        }
    }

    get isLoggedIn() {
        return !!this.user;
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
            const user = await this._loadCurrentUser(accessToken);
            await this.storage.set(AUTH_STORAGE_KEY, {accessToken});
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

    async _loadCurrentUser(accessToken) {
        return this.client.get("/users/me", accessToken);
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