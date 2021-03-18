import React, {useContext} from 'react'
import AuthStore from "./auth/AuthStore";
import ApiClient from "./api/ApiClient";

const apiClient = new ApiClient();

class RootStore {
    constructor() {
        this.authStore = new AuthStore(this, apiClient);
    }
}

const RootStoreContext = React.createContext();

const useAuth = (): AuthStore => {
    return useContext(RootStoreContext).authStore;
};

function StoreProvider({children}) {
    const rootStore = new RootStore();
    return <RootStoreContext.Provider value={rootStore}>{children}</RootStoreContext.Provider>;
}

export {
    RootStore,
    useAuth,
    StoreProvider
}
