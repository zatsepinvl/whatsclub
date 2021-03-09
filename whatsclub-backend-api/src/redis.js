const Redis = require("ioredis");
const redis = new Redis();

redis.on("error", function (error) {
    console.error("Redis client error:", error);
});

const subscriber = new Redis();
const publisher = new Redis();

module.exports = {
    redis,
    subscriber,
    publisher
}
