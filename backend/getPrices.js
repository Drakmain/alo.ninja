import {worlds} from './world.js';

const options = {
    year: 'numeric',
    month: 'numeric',
    day: 'numeric',
    hour: 'numeric',
    minute: 'numeric',
    second: 'numeric',
    timeZone: 'Europe/Paris'
};

export async function getPrices(marketOrdersCollection, item) {

    let object = []

    let result = await marketOrdersCollection.aggregate([{
        $match: {
            "ItemTypeId": {$in: ["T1_" + item, "T2_" + item, "T3_" + item, "T4_" + item, "T5_" + item, "T6_" + item, "T7_" + item, "T8_" + item]},
            "AuctionType": "offer"
        }
    }, {
        $sort: {"ItemTypeId": 1, "createdAt": -1} // Ensure sorting by createdAt for each ItemTypeId
    }, {
        $group: {
            _id: {
                city: "$LocationId", itemType: "$ItemTypeId"
            }, documents: {$push: "$$ROOT"} // Accumulate all documents into an array
        }
    }, {
        $project: {
            documents: {$slice: ["$documents", 10]} // Keep only the last 10 documents for each ItemTypeId
        }
    }]).toArray()

    result.forEach(cityValue => {

        const cityName = worlds.find(item => parseInt(item.Index) === cityValue._id.city).UniqueName

        let totalWeight = 0;
        let weightedSum = 0;

        let min = +Infinity
        let max = -Infinity

        cityValue.documents.forEach(({UnitPriceSilver, Amount}) => {

            min = Math.min(min, UnitPriceSilver);
            max = Math.max(max, UnitPriceSilver);

            weightedSum += UnitPriceSilver * Amount;
            totalWeight += Amount;

            //const date = new Date(value._id.getTimestamp());
            //const formatter = new Intl.DateTimeFormat('fr-FR', options);
            //const parisTime = formatter.format(date);
            //console.log("Creation time:", parisTime);
        });

        if (totalWeight === 0) return null;
        const avg = weightedSum / totalWeight

        object.push({
            item_id: cityValue._id.itemType,
            city: cityName,
            avg: avg,
            totalWeight: totalWeight,
            sell_price_min: min,
            sell_price_max: max
        })
    })

    return object
}
