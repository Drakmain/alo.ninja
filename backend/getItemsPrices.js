import {worlds} from './world.js';
import {ObjectId} from "mongodb";

const options = {
    year: 'numeric',
    month: 'numeric',
    day: 'numeric',
    hour: 'numeric',
    minute: 'numeric',
    second: 'numeric',
    timeZone: 'Europe/Paris'
};

export async function getItemsPrices(marketOrdersCollection, items) {

    let object = []

    let arr = items.split(",")

    const last24h = new ObjectId(Math.floor(new Date(Date.now() - 24 * 60 * 60 * 1000) / 1000).toString(16) + "0000000000000000")

    let result = await marketOrdersCollection.aggregate([{
        $match: {
            "_id": {$gte: last24h}, "ItemTypeId": {$in: arr}, "AuctionType": "offer"
        }
    }, {
        $sort: {"_id": -1}
    }, {
        $group: {
            _id: {
                city: "$LocationId", itemType: "$ItemTypeId"
            }, documents: {$push: "$$ROOT"}
        }
    }, {
        $project: {
            documents: {$slice: ["$documents", 30]}
        }
    }]).toArray()

    result.forEach(cityValue => {

        const cityName = worlds.find(item => parseInt(item.Index) === cityValue._id.city).UniqueName

        let timearr = []

        let totalWeight = 0;
        let weightedSum = 0;

        let min = +Infinity
        let max = -Infinity

        cityValue.documents.forEach(({UnitPriceSilver, Amount, _id}) => {

            min = Math.min(min, UnitPriceSilver);
            max = Math.max(max, UnitPriceSilver);

            weightedSum += UnitPriceSilver * Amount;
            totalWeight += Amount;

            const date = new Date(_id.getTimestamp());
            //const formatter = new Intl.DateTimeFormat('fr-FR', options);
            //const parisTime = formatter.format(date);
            //console.log("Creation time:", date);

            timearr.push(date)
        });

        if (totalWeight === 0) return null;
        const avg = weightedSum / totalWeight

        object.push({
            item_id: cityValue._id.itemType,
            city: cityName,
            cityId: cityValue._id.city,
            avg: avg,
            totalWeight: totalWeight,
            sell_price_min: min,
            sell_price_max: max,
            lastTime: Math.min(...timearr),
        })
    })

    return object
}
