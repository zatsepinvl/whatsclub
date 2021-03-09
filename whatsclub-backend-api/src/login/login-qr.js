const express = require("express");
const jwt = require("../jwt");
const events = require("events");
const uuid = require("uuid");
const {redis, publisher, subscriber} = require("../redis");

const QR_LOGIN_SCOPE = "login:qr";
const LOGIN_QR_SESSION_CHANNEL = "login:qr:session";

const loginSessionEventEmitter = new events.EventEmitter();
const app = module.exports = express();

subscriber.on("message", function (channel, message) {
    const session = JSON.parse(message);
    const eventId = "login:qr:session" + session.sessionId;
    loginSessionEventEmitter.emit(eventId, session);
});
subscriber.subscribe(LOGIN_QR_SESSION_CHANNEL);

app.post("/login/qr/sessions", (req, res) => {
    const sessionId = uuid.v4()
    const accessToken = jwt.issueJwt({sessionId}, QR_LOGIN_SCOPE, "5m");
    const loginSession = {sessionId, accessToken};
    res.send(loginSession);
});

app.get("/login/qr/sessions/:sessionId", jwt.authenticated(QR_LOGIN_SCOPE), async (req, res) => {
    const {sessionId} = req.token;
    const {sessionId: sessionIdFromPath} = req.params;
    if (sessionId !== sessionIdFromPath) {
        req.status(404).send();
    }
    const updatedSession = await redis.get(sessionId).then(JSON.parse);
    const sessionHandler = async (session) => {
        if (session.status === "accepted") {
            const username = session.username;
            const accessToken = jwt.issueAccessToken({username}, "1d");
            res.send({session, accessToken});
        } else {
            res.send({session});
        }
    };
    if (updatedSession) {
        await sessionHandler(updatedSession);
    } else {
        const eventId = "login:qr:session" + sessionId;
        const timeoutId = setTimeout(() => {
            loginSessionEventEmitter.removeAllListeners(eventId);
            res.send({});
        }, 10000);
        loginSessionEventEmitter.once(eventId, async (session) => {
            await sessionHandler(session);
            clearTimeout(timeoutId);
        });

    }
});

app.put("/login/qr/sessions/:sessionId", jwt.authenticated(), async (req, res) => {
    const {username} = req.token;
    const {sessionId} = req.params;
    const {status} = req.body;
    const session = {sessionId, username, status};
    await redis.set(sessionId, JSON.stringify(session), "EX", 300);
    await publisher.publish(LOGIN_QR_SESSION_CHANNEL, JSON.stringify(session));
    res.send(session);
});