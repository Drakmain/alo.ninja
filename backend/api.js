import {createServer} from "http";
import {Server} from "socket.io";
import {MongoClient} from "mongodb";
import express from 'express';
import dotenv from 'dotenv';
import {getResourcesPrices} from "./getResourcesPrices.js";
import {getPricesHistory} from "./getPricesHistory.js";
import {getItems} from "./getItems.js";
import {getItemsPrices} from "./getItemsPrices.js";

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
const itemsListItemsListCollection = aloDB.collection("itemsList")

/* -------------------- */

/* --- Init Socket IO --- */

const io = new Server(httpServer);

io.on("connection", (socket) => {
    console.log("Connection from " + socket.id)
});

/* ----------------------- */

app.get('/getResourcesPrices', async (req, res) => {
    const item = req.query.item;
    const level = req.query.level;

    if (item === undefined) {
        res.status(400).send("Missing item params");
        return
    }

    if (level === undefined) {
        res.status(400).send("Missing level params");
        return
    }

    console.log(`GET http://${host}:${port}/getPrices : item=${item}, level=${level}`)

    res.status(200).send(await getResourcesPrices(marketOrdersCollection, item, level))

    console.log(`GET http://${host}:${port}/getPrices : Done`)
})

app.get('/getPricesHistory', async (req, res) => {
    const item = req.query.item;

    if (item === undefined) {
        res.status(400).send("Missing item params");
        return
    }

    console.log(`GET http://${host}:${port}/getPricesHistory : item=${item}`)

    res.status(200).send(await getPricesHistory(marketOrdersCollection, item))

    console.log(`GET http://${host}:${port}/getPricesHistory : Done`)
})

app.get('/getItems', async (req, res) => {
    const item = req.query.item;

    if (item === undefined) {
        res.status(400).send("Missing item params");
        return
    }

    console.log(`GET http://${host}:${port}/getItems : item=${item}`)

    res.status(200).send(await getItems(itemsListItemsListCollection, item))

    console.log(`GET http://${host}:${port}/getItems : Done`)
})

app.get('/getItemsPrices', async (req, res) => {
    const items = req.query.items;

    if (items === undefined) {
        res.status(400).send("Missing items params");
        return
    }

    console.log(`GET http://${host}:${port}/getItemsPrices : item=${items}`)

    res.status(200).send(await getItemsPrices(marketOrdersCollection, items))

    console.log(`GET http://${host}:${port}/getItemsPrices : Done`)
})

httpServer.listen(port, () => {
    console.log(`Server running at http://${host}:${port}`);
});
