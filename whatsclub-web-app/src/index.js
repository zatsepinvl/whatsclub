import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import App from "./app/App";
import {AuthProvider} from "./app/auth/UseAuth";

ReactDOM.render(
    <React.StrictMode>
        <AuthProvider>
            <App/>
        </AuthProvider>
    </React.StrictMode>,
    document.getElementById("root")
);
