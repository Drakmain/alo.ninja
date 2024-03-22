import {MongoClient} from "mongodb";
import dotenv from 'dotenv';
import {worlds} from './world.js';

dotenv.config()

/* --- Init Var --- */

const options = {
    year: 'numeric',
    month: 'numeric',
    day: 'numeric',
    hour: 'numeric',
    minute: 'numeric',
    second: 'numeric',
    timeZone: 'Europe/Paris'
};
const mongoURI = process.env.MONGOURI

/* ---------------- */

/* --- Init MongoDB --- */

const client = new MongoClient(mongoURI);
await client.connect()
const aloDB = client.db("alo");
const marketOrdersCollection = aloDB.collection("marketOrders")

/* -------------------- */

try {
    let result = await marketOrdersCollection.aggregate([{
        $match: {
            "ItemTypeId": {$in: ["T1_ROCK", "T2_ROCK", "T3_ROCK", "T4_ROCK", "T5_ROCK", "T6_ROCK", "T7_ROCK", "T8_ROCK"]}
        }
    }, {
        $sort: {"ItemTypeId": 1, "createdAt": -1} // Ensure sorting by createdAt for each ItemTypeId
    }, {
        $group: {
            _id: "$ItemTypeId", documents: {$push: "$$ROOT"} // Accumulate all documents into an array
        }
    }, {
        $project: {
            documents: {$slice: ["$documents", 10]} // Keep only the last 10 documents for each ItemTypeId
        }
    }])

    result = await result.toArray()

    result.forEach(tier => {

        console.log("Item: " + tier._id)

        let totalWeight = 0;
        let weightedSum = 0;

        tier.documents.forEach(value => {

            weightedSum += value.UnitPriceSilver * value.Amount;
            totalWeight += value.Amount;

            const foundItem = worlds.find(item => parseInt(item.Index) === value.LocationId);

            const date = new Date(value._id.getTimestamp());
            const formatter = new Intl.DateTimeFormat('fr-FR', options);
            const parisTime = formatter.format(date);

            //console.log("Amount : " + foundItem.UniqueName)
            //console.log("Amount : " + value.Amount)
            //console.log("Price Silver: " + value.UnitPriceSilver)
            //console.log("Creation time:", parisTime);
            //console.log("\n")
        });

        if (totalWeight === 0) return 0;
        console.log(weightedSum / totalWeight)
        console.log(totalWeight)

        console.log("####################################")
    })


} catch (error) {
    console.log(error)
}

process.exit()
