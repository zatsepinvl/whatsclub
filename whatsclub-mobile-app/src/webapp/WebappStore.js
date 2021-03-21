import {makeAutoObservable} from "mobx";
import ApiClient from "../api/ApiClient";
import AuthStore from "../auth/AuthStore";

class WebappStore {

    constructor(authStore: AuthStore, apiClient: ApiClient) {
        makeAutoObservable(this, {client: false, auth: false});
        this.client = apiClient;
        this.auth = authStore;
    }

    async acceptWebappQrLogin(sessionId) {
        return this._putWebappQrLogin(sessionId, "accepted")
    }

    async rejectWebappQrLogin(sessionId) {
        return this._putWebappQrLogin(sessionId, "rejected")
    }

    _putWebappQrLogin(sessionId, status) {
        const token = this.auth.accessToken;
        return this.client.put(`/login/qr/sessions/${sessionId}`, token, {status});
    }

}

export default WebappStore;