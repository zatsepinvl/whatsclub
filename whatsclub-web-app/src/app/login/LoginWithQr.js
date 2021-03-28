import {useEffect, useState} from "react";
import {useAuth} from "../auth/UseAuth";
import {useHistory, useLocation} from "react-router-dom";
import QRCode from "qrcode.react";
import "./Login.css";
import {Loader} from "../../components/loader/Loader";

function LoginWithQr() {
    const auth = useAuth();
    const history = useHistory();
    const location = useLocation();
    const {from} = location.state || {from: {pathname: "/"}};
    const [qrData, setQrData] = useState();

    useEffect(() => {
        if (auth.user) {
            history.push(from);
            return;
        }

        async function loginWithQr() {
            const data = await auth.loginWithQr();
            setQrData(data);
        }

        loginWithQr();
    }, [auth]);

    return (
        <div className="login-container">
            <div className="login-content">
                <div className="login-guide">
                    <span className="login-guide-title">To use WhatsClubb on your computer:</span>
                    <ol>
                        <li>Open WhatsClubb on your phone</li>
                        <li>Click <b>WhatsClubb Web</b> button</li>
                        <li>Point your phone to this screen to capture the code</li>
                    </ol>
                </div>
                {qrData ? (
                    <QRCode value={JSON.stringify(qrData)} size={222} level="M"/>
                ) : (
                    <div className="login-loading">
                        <Loader/>
                    </div>
                )}
            </div>
        </div>
    )

}

export default LoginWithQr;