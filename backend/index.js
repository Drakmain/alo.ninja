import {connect} from "nats";
import {createServer} from "http";
import {Server} from "socket.io";
import {MongoClient} from "mongodb";
import express from 'express';
import dotenv from 'dotenv';

dotenv.config()

/* --- Init Var --- */

const port = process.env.PORT
const host = process.env.HOST
const mongoURI = process.env.MONGOURI

/* ---------------- */

/* --- Init Express --- */

const app = express();
const httpServer = createServer(app);

/* -------------------- */

/* --- Init MongoDB --- */

const client = new MongoClient(mongoURI);
client.connect()
const aloDB = client.db("alo");

/* -------------------- */

/* --- Init Socket IO --- */

const io = new Server(httpServer, {
    cors: {
        origin: "*", methods: ["GET", "POST"]
    }
});

io.on("connection", (socket) => {
    console.log("Connection from " + socket.id)
});

/* ----------------------- */

app.get('/', (req, res) => {
    res.send('Hello World!')
})

httpServer.listen(port, () => {
    console.log(`Server running at http://${host}${port}`);
});

(async () => {

    const marketOrdersCollection = aloDB.collection("marketOrders")

    const nc = await connect({
        servers: "nats.albion-online-data.com:4222", user: "public", pass: "thenewalbiondata",
    });

    const subscription = nc.subscribe('marketorders.deduped', {queue: 'workers'});

    (async () => {
        for await (const msg of subscription) {
            console.log(`Received message: ${msg.data}`);
            io.emit("newMarketOrders", msg.string())

            let object = msg.json()

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
