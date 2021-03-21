import React, {useContext} from 'react'
import RootStore from "./RootStore";
import AuthStore from "../auth/AuthStore";
import WebappStore from "../webapp/WebappStore";

const RootStoreContext = React.createContext();

const useAuth = (): AuthStore => {
    return useContext(RootStoreContext).authStore;
};

const useWebapp = (): WebappStore => {
    return useContext(RootStoreContext).webappStore;
}

const useRootStore = (): RootStore => {
    return useContext(RootStoreContext);
}

function StoreProvider({children}) {
    const rootStore = new RootStore();
    return <RootStoreContext.Provider value={rootStore}>{children}</RootStoreContext.Provider>;
}

export {
    StoreProvider,
    useRootStore,
    useAuth,
    useWebapp
}
