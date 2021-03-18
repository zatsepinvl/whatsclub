const express = require("express");
const morgan = require('morgan')
const jwt = require("./jwt");
const users = require("./users");
const login = require("./login");

const SERVER_PORT = process.env.PORT || 3000;

const app = express();
app.use(express.json());
app.use(jwt.unauthorizedErrors());
app.use(morgan("dev"));
app.use(login);
app.use(users);

app.listen(SERVER_PORT, () => console.log(`Server listening at port ${SERVER_PORT}`));