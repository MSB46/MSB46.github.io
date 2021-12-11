const MongoBackend = require("./services/backend/MongoBackend");
const RedisBackend = require("./services/backend/RedisBackend");
const MySQLBackend = require("./services/backend/MYSQLBackend");

async function runMongo() {
    const mongoBackend = new MongoBackend();
    return mongoBackend.max();
}

async function runRedis() {
    const redisBackend = new RedisBackend();
    return redisBackend.max();
}

async function runMySQL() {
    const mySQLBackend = new MySQLBackend();
    return mySQLBackend.max();
}


// We are using promises because in the CoinAPI class, we're using async wait
runMySQL()
    .then((result) => {
        console.log(result);
    })
    .catch((err) => console.error(err));
