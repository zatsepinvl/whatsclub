const express = require("express");
const jwt = require("../jwt");

const TEST_USER = {username: "user@mail.com", password: "password"};
const TEST_MFA_PHONE_OTP = "4332";
const MFA_LOGIN_SCOPE = "login:mfa";

const app = module.exports = express();

app.post("/login/password", (req, res) => {
    const {username, password} = req.body;
    if (username === TEST_USER.username && password === TEST_USER.password) {
        const token = jwt.issueJwt({username}, MFA_LOGIN_SCOPE, "5m");
        //Send OTP to phone here
        res.send({
            mfa: {required: true, type: "phone-otp"},
            loginSessionToken: token
        })
    } else {
        res.status(401).send({message: "Invalid username or password", code: "IUOP01"});
    }
});

app.post("/login/mfa/phone-otp", jwt.authenticated(MFA_LOGIN_SCOPE), (req, res) => {
    const {otp} = req.body;
    if (otp === TEST_MFA_PHONE_OTP) {
        const {username} = req.token;
        const accessToken = jwt.issueAccessToken({username});
        res.status(200).send({accessToken});
    } else {
        res.status(401).json({message: "Invalid login session token or OTP", code:"IOTP01"});
    }
});