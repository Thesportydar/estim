const fs = require('fs');
const { MongoClient } = require("mongodb");
const dbName = 'estim';
const uri = 'mongodb://tsd:root@127.0.0.1:27017/' + dbName
const client = new MongoClient(uri);

let data = fs.readFileSync('./steam.json');
let game_file = JSON.parse(data);

async function run() {
try {
    const database = client.db(dbName);
    const games = database.collection("games");

    const result_insert = await games.insertMany(game_file);
    console.log(result_insert)

    const result_update = await games.updateMany( {}, [{ "$set": { "release_date": { "$toDate": "$release_date" } } }])
    console.log(result_update)
} finally {
    await client.close();
}
}
run().catch(console.dir);
