const jwt = require("jsonwebtoken");
const expressJwt = require("express-jwt");
const AUTHENTICATED_SCOPE = "authenticated";
const TEMP_JWT_SECRET = "NEVER_USE_IN_PRODUCTION_super_secret_key_1";

module.exports = {
    unauthorizedErrors: function () {
        return (err, req, res, next) => {
            if (err.name === "UnauthorizedError") {
                res.status(401).send({message: "Unauthenticated"});
            } else {
                next();
            }
        }
    },
    authenticated: function (scope = AUTHENTICATED_SCOPE) {
        return [
            expressJwt({secret: TEMP_JWT_SECRET, algorithms: ['HS256'], requestProperty: 'token'}),
            this.requireScope(scope)
        ]
    },
    requireScope: function (targetScope) {
        return (req, res, next) => {
            const {scope} = req.token;
            if (scope !== targetScope) {
                res.status(401).json({message: "Unauthenticated"});
            }
            next();
        }
    },
    issueAccessToken: function (user, expiresIn = "5d") {
        return this.issueJwt(user, AUTHENTICATED_SCOPE, expiresIn);
    },
    issueJwt: function (payload, scope, expiresIn) {
        return jwt.sign({...payload, scope}, TEMP_JWT_SECRET, {expiresIn});
    }
}