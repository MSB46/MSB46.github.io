/* eslint-disable no-useless-constructor */
/* eslint-disable class-methods-use-this */
/* eslint-disable no-empty-function */
// Get the MongoClient object from the MongoDB module
const {MongoClient} = require("mongodb");
const CoinAPI = require('../CoinAPI');

class MongoBackend {

    constructor() {
        this.coinAPI = new CoinAPI();

        // Define the Mongo URL. The URL to the server.
        // Freely select which database to use.
        // If it doesn't exist, it'll be create
        this.mongoUrl = "mongodb://localhost:37017/maxcoin";

        this.client = null;
        this.collection = null;
    }

    async connect() {

        // new instance of the mongoClient and its arguments we pass in this.mongoUrl
        const mongoClient = new MongoClient(this.mongoUrl, {
            useUnifiedTopology: true,
            useNewUrlParser: true
        });
        // Mongo DB driver works w/ different versions of MongoDB. Prevents deprecation warnings

        this.client = await mongoClient.connect();
        // We now have a MongoDB connection

        this.collection = this.client.db("maxcoin").collection("values");
        // Create an object that references the collection we'll work with
        return this.client;
    }

    async disconnect() {
        if(this.client){
            return this.client.close();
        }
        return false;
    }

    async insert() {
        const data = await this.coinAPI.fetch();
        const documents = [];
        Object.entries(data.bpi).forEach((entry) => {
          documents.push({
              date: entry[0],
              value: entry[1],
          })
        });
        return this.collection.insertMany(documents);
    }

    async getMax() {
        // Sort by the value in desceding order and get one value after another from it
        return this.collection.findOne({}, {sort: {value: -1}});
    }

    async max() {
        console.info("Connection to MongoDB");
        console.time("mongodb-connect");
        const client = await this.connect();
        if (client.isConnected()) {
            console.info("Successful connection to MongoDB");
        } else {
            throw new Error("Connection to MongoDB failed")
        }
        console.timeEnd("mongodb-connect");

        console.info("Inserting into MongoDB");
        console.time("mongodb-insert");
        const insertResult = await this.insert();
        console.timeEnd("mongodb-insert");

        console.info(`Inserted ${insertResult.result.n} documents into MongoDB`);

        console.info("Querying MongoDB");
        console.time("mongodb-find");
        const doc = await this.getMax();
        console.timeEnd("mongodb-find");

        console.info("Disconnecting from MongoDB");
        console.time("mongodb-disconnect");
        await this.disconnect();
        console.timeEnd("mongodb-disconnect");

        return {
            date: doc.date,
            value: doc.value,
        }

    }
}

module.exports = MongoBackend;