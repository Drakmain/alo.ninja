import {connect} from "nats";
import {MongoClient} from "mongodb";
import dotenv from 'dotenv';

dotenv.config()

/* --- Init Var --- */

const mongoURI = process.env.MONGOURI

/* ---------------- */

/* --- Init MongoDB --- */

const client = new MongoClient(mongoURI);
await client.connect()
const aloDB = client.db("alo");

/* -------------------- */

/* --- Nats --- */

(async () => {

    const marketOrdersCollection = aloDB.collection("marketOrders")

    await marketOrdersCollection.createIndex({"expireAt": 1}, {expireAfterSeconds: 0});

    const nc = await connect({
        servers: "nats.albion-online-data.com:4222", user: "public", pass: "thenewalbiondata",
    });

    const subscription = nc.subscribe('marketorders.deduped', {queue: 'workers'});

    (async () => {
        for await (const msg of subscription) {
            console.log(`Received message: ${msg.data}`);
            //io.emit("newMarketOrders", msg.string())

            let object = msg.json()

            object.expireAt = new Date(object.Expires)

            delete object.Expires

            delete object.Id

            try {
                marketOrdersCollection.insertOne(object)
            } catch (error) {
                console.log(error)
            }

        }
    })().then(() => {
        console.log('marketorders.deduped subscription closed.');
    });

    process.on('SIGINT', async () => {
        await nc.drain();
        process.exit();
    });
})();