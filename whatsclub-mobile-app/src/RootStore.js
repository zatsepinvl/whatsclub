import AuthStore from "./auth/AuthStore";
import ApiClient from "./api/ApiClient";
import WebappStore from "./webapp/WebappStore";

const apiClient = new ApiClient();

class RootStore {
    constructor() {
        this.authStore = new AuthStore(this, apiClient);
        this.webappStore = new WebappStore(this, apiClient);
    }
}

export default RootStore;