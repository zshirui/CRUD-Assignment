const mongodb = require('mongodb');

class Database {
    collections = {
        'blogs': null,
        'users': null
    };
    client = null;
    database = null;

    async setup() {
        this.client = await new mongodb.MongoClient('mongodb+srv://user:user@cluster0.51jdlmh.mongodb.net/?retryWrites=true&w=majority').connect();
        this.database = await this.client.db('database');
        let listedCollections = await this.database.listCollections({}, {nameOnly: true}).toArray();
        
        let names = listedCollections.map((collection) => {
            return collection.name;
        });

        Object.keys(this.collections).forEach(async (name) => {
            if (names.includes(name)) {

                this.collections[name] = await this.database.collection(name);
            } else {

                this.collections[name] = await this.database.createCollection(name);
            }
        });

    }
};

module.exports = Database;