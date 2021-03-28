const express = require("express");
const jwt = require("../jwt");
const events = require("events");
const uuid = require("uuid");
const {redis, publisher, subscriber} = require("../redis");

const QR_LOGIN_SCOPE = "login:qr";
const LOGIN_QR_SESSION_CHANNEL = "login:qr:session";

const loginSessionEventEmitter = new events.EventEmitter();
subscriber.subscribe(LOGIN_QR_SESSION_CHANNEL);
subscriber.on("message", function (channel, message) {
    const session = JSON.parse(message);
    const eventId = "login:qr:session:" + session.sessionId;
    loginSessionEventEmitter.emit(eventId, session);
});

const app = module.exports = express();

app.post("/login/qr/sessions", (req, res) => {
    const sessionId = uuid.v4()
    const accessToken = jwt.issueJwt({sessionId}, QR_LOGIN_SCOPE, "5m");
    const loginSession = {sessionId, accessToken};
    res.send(loginSession);
});

app.get("/login/qr/sessions/:sessionId/events", jwt.authenticated(QR_LOGIN_SCOPE), async (req, res) => {
    const {sessionId} = req.token;
    const {sessionId: sessionIdFromPath} = req.params;
    if (sessionId !== sessionIdFromPath) {
        req.status(404).send();
        return;
    }

    res.setHeader("Content-Type", "text/event-stream");
    res.setHeader("Connection", "keep-alive");
    res.setHeader("Cache-Control", "no-transform");
    res.flushHeaders();

    const updatedSession = await redis.get(sessionId).then(JSON.parse);
    if (updatedSession) {
        await handleSession(updatedSession, res);
    } else {
        const eventId = createLoginSessionEventId(sessionId);
        loginSessionEventEmitter.once(eventId, async (session) => {
            await handleSession(session, res);
        });
    }
    const ping = setInterval(() => res.write("event: ping\n\n"), 10000);
    req.on('close', () => {
        clearInterval(ping);
    });
});

async function handleSession(session, res) {
    if (session.status === "accepted") {
        const username = session.username;
        const user = {username};
        const accessToken = jwt.issueAccessToken({username}, "1d");
        const data = JSON.stringify({session, accessToken, user})
        res.write(`data: ${data}\n\n`);
    } else {
        const data = JSON.stringify({session})
        res.write(`data: ${data}\n\n`);
    }
}

function createLoginSessionEventId(sessionId) {
    return "login:qr:session:" + sessionId;
}

app.put("/login/qr/sessions/:sessionId", jwt.authenticated(), async (req, res) => {
    const {username} = req.token;
    const {sessionId} = req.params;
    const {status} = req.body;
    const session = {sessionId, username, status};
    await redis.set(sessionId, JSON.stringify(session), "EX", 300);
    await publisher.publish(LOGIN_QR_SESSION_CHANNEL, JSON.stringify(session));
    res.send(session);
});

