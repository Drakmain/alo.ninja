import {createServer} from "http";
import {Server} from "socket.io";
import {MongoClient} from "mongodb";
import express from 'express';
import dotenv from 'dotenv';
import {getPrices} from "./getPrices.js";

dotenv.config()

/* --- Init Var --- */

const port = process.env.PORT
const host = process.env.HOST
const mongoURI = process.env.MONGOURI

/* ---------------- */

/* --- Init Express --- */

const app = express();
const httpServer = createServer(app);

app.use(function (req, res, next) {
    res.setHeader('Access-Control-Allow-Origin', 'http://localhost:4200');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
    res.setHeader('Access-Control-Allow-Credentials', true);
    next();
});

/* -------------------- */

/* --- Init MongoDB --- */

const client = new MongoClient(mongoURI);
await client.connect()
const aloDB = client.db("alo");
const marketOrdersCollection = aloDB.collection("marketOrders")

/* -------------------- */

/* --- Init Socket IO --- */

const io = new Server(httpServer);

io.on("connection", (socket) => {
    console.log("Connection from " + socket.id)
});

/* ----------------------- */

app.get('/', (req, res) => {
    res.send('Hello World!')
})

app.get('/getPrices', async (req, res) => {
    const item = req.query.item;

    if (item === undefined) {
        res.status(400).send("Missing item params");
        return
    }

    res.status(200).send(await getPrices(marketOrdersCollection, item))

    console.log(`http://${host}:${port}/getPrices GET : Done`)
})

httpServer.listen(port, () => {
    console.log(`Server running at http://${host}:${port}`);
});
