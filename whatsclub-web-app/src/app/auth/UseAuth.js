//https://usehooks.com/useAuth/

import React, {useState, useContext, createContext, useRef} from "react";
import axios from "axios";
import {EventSourcePolyfill} from 'event-source-polyfill';

const AuthContext = createContext();

function AuthProvider({children}) {
    const auth = useProvideAuth();
    return <AuthContext.Provider value={auth}>{children}</AuthContext.Provider>;
}

const useAuth = () => {
    return useContext(AuthContext);
};

function useProvideAuth() {
    const source = useRef(null);

    const [loaded, setLoaded] = useState(false);
    const [user, setUser] = useState(null);

    const load = async () => {
        try {
            const accessToken = localStorage.getItem("accessToken");
            if (!accessToken) {
                return;
            }
            const {data: user} = await axios.get("/api/users/me", {
                headers: {
                    "Authorization": `Bearer ${accessToken}`
                }
            });
            setUser(user);
        } catch (e) {
            console.warn(e);
        } finally {
            setLoaded(true);
        }
    }

    const loginWithQr = async () => {
        const {data: session} = await axios.post("/api/login/qr/sessions");
        const {sessionId, accessToken} = session;
        const events = new EventSourcePolyfill(`/api/login/qr/sessions/${sessionId}/events`, {
            headers: {
                "Authorization": `Bearer ${accessToken}`
            }
        });
        source.current = events;
        events.onmessage = (event) => {
            const data = JSON.parse(event.data);
            const {user, accessToken} = data;
            localStorage.setItem("accessToken", accessToken);
            setUser(user);
            source.current.close();
            source.current = null;
        };
        console.log("sessionId", sessionId);
        return {
            action: "login:qr",
            sessionId: session.sessionId
        }
    };

    const logout = () => {
        setUser(false);
        localStorage.removeItem("accessToken")
    };

    return {
        user,
        loaded,
        load,
        loginWithQr,
        logout,
    };
}

export {
    AuthProvider,
    useAuth
}