//https://usehooks.com/useAuth/

import React, {useState, useContext, createContext, useRef} from "react";
import axios from "axios";
import {EventSourcePolyfill} from 'event-source-polyfill';

const AuthContext = createContext();

function AuthProvider({children}) {
    const auth = Auth();
    return <AuthContext.Provider value={auth}>{children}</AuthContext.Provider>;
}

const useAuth = () => {
    return useContext(AuthContext);
};

function Auth() {
    const eventSource = useRef(null);

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
        const {sessionId, accessToken: loginAccessToken} = session;
        console.log("[app] loginAccessToken", loginAccessToken);
        console.log("[app] sessionId", sessionId);
        subscribeOnSession(sessionId, loginAccessToken);
        return {
            action: "login:qr",
            sessionId: session.sessionId
        }
    };

    const subscribeOnSession = (sessionId, loginAccessToken) => {
        const events = new EventSourcePolyfill(`/api/login/qr/sessions/${sessionId}/events`, {
            headers: {
                "Authorization": `Bearer ${loginAccessToken}`
            }
        });
        eventSource.current = events;
        events.onmessage = (event) => {
            const data = JSON.parse(event.data);
            const {user, accessToken} = data;
            localStorage.setItem("accessToken", accessToken);
            console.log("[app] accessToken", accessToken);
            setUser(user);
            eventSource.current.close();
            eventSource.current = null;
        };
        events.onerror = function (e) {
            events.close();
            setTimeout(() => subscribeOnSession(sessionId, loginAccessToken), 1000);
        };
    }

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