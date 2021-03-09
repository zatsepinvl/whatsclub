const express = require("express");
const loginMfa = require("./login-mfa");
const loginQr = require("./login-qr");

const app = module.exports = express();

app.use(loginMfa);
app.use(loginQr);