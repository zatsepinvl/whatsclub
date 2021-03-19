import {makeAutoObservable} from "mobx";
import ApiClient from "../api/ApiClient";
import RootStore from "../RootStore";

class WebappStore {

    constructor(rootStore: RootStore, apiClient: ApiClient) {
        makeAutoObservable(this, {client: false, auth: false});
        this.client = apiClient;
        this.auth = rootStore.authStore;
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