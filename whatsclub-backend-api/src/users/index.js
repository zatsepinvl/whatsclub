const express = require("express");
const jwt = require("../jwt");

const app = module.exports = express();

app.get("/users/me", jwt.authenticated(), (req, res) => {
    const {username} = req.token;
    res.send({username});
})