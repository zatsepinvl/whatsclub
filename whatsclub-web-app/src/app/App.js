import './App.css';
import {
    BrowserRouter as Router,
    Switch,
    Route,
    Redirect
} from "react-router-dom";
import {useAuth} from "./auth/UseAuth.js";
import AuthenticatedOnly from "./auth/AuthenticatedOnly";
import Home from "./home/Home";
import LoginWithQr from "./login/LoginWithQr";
import {useEffect} from "react";
import {Loader} from "../components/loader/Loader";

function App() {
    const auth = useAuth();

    useEffect(() => {
        auth.load();
    }, []);

    return (
        <div className="app-container">
            <div className="app-background">
                <div className="app-background-top">
                    <span className="app-background-title">WhatsClubb Web</span>
                </div>
                <div className="app-background-bottom"/>
            </div>
            <div className="app-content">
                {!auth.loaded ? (
                    <div className="app-loader">
                        <Loader/>
                    </div>
                ) : (
                    <Router>
                        <Switch>
                            <Route exact path="/login">
                                <LoginWithQr/>
                            </Route>
                            <Route exact path="/home">
                                <AuthenticatedOnly>
                                    <Home/>
                                </AuthenticatedOnly>
                            </Route>
                            <Route exact path="/">
                                {auth.user ? <Redirect to="/home"/> : <Redirect to="/login"/>}
                            </Route>
                        </Switch>
                    </Router>
                )}
            </div>
        </div>
    )
}

export default App;
