import AuthStore from "../auth/AuthStore";
import ApiClient from "../api/ApiClient";
import WebappStore from "../webapp/WebappStore";
import {StorageService} from "../storage/StorageService";
import {makeAutoObservable, runInAction} from "mobx";

const apiClient = new ApiClient();
const storage = new StorageService();

class RootStore {
    storesLoaded = false

    constructor() {
        makeAutoObservable(this, {authStore: false, webappStore: false});
        this.authStore = new AuthStore(apiClient, storage);
        this.webappStore = new WebappStore(this.authStore, apiClient);
    }

    async loadStores() {
        await this.authStore.load();
        runInAction(() => {
            this.storesLoaded = true;
        });
    }

    get isStoresLoaded() {
        return !!this.storesLoaded;
    }
}

export default RootStore;