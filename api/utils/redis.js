/**
 * Redis client
 */
var Redis = require("ioredis");

var redis = {},
    common = require('./common.js');

var password = common.config.redis.sentinelpwd;

var redisClient;

// initialize redis client
function initRedis() {
    if (undefined == redisClient || null == redisClient) {
	redisClient = new Redis({
	    sentinels: [
		{ host: "redis-ha-announce-0.redis.svc.cluster.local", port: 26379 },
		{ host: "redis-ha-announce-1.redis.svc.cluster.local", port: 26379 },
		{ host: "redis-ha-announce-2.redis.svc.cluster.local", port: 26379 }
	    ],
	    name: "mymaster",
	    sentinelPassword: password
	});
    }
}
initRedis(); //init

// on connected
redisClient.on("connect", function() {
    common.log("Connected to Redis");
});

/**
 * 
 * @param {string} topic - topic of pub/sub
 * @param {string} content - content that want to be published
 */
redis.pub = function(topic, content) {
    initRedis();
    redisClient.publish(topic, content, function(err, result) {
        if (!err) {
            common.log("Publishing to Redis got error: ", err);
            return false;
        }
        else {
            common.log("result: ", result);
            return true;
        }
    });
    return true;
};

redis.sub = function(topic, cb) {
    redisClient.subscribe(topic, function(err, reply) {
        common.log("Subscribed to topic: " + reply);
    });
    // on error event
    redisClient.on("error", function(err) {
        common.log("Invoke Redis get error: ", err);
    });
    // on message
    redisClient.on("message", function(channel, message) {
        cb(channel, message);
    });
};

module.exports = redis;
