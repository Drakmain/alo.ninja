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

export async function getPricesHistory(marketOrdersCollection, item) {

    const last24h = new ObjectId(Math.floor(new Date(Date.now() - 24 * 60 * 60 * 1000) / 1000).toString(16) + "0000000000000000")

    const itemArr = item.split(",")

    return await marketOrdersCollection.aggregate([{
        $match: {
            "ItemTypeId": {$in: itemArr}, "AuctionType": "offer", "_id": {$gte: last24h}
        }
    }, {
        $addFields: {
            "createdAt": {$toDate: "$_id"}
        }
    }, {
        $addFields: {
            "year": {$year: "$createdAt"},
            "month": {$month: "$createdAt"},
            "day": {$dayOfMonth: "$createdAt"},
            "hour": {$hour: "$createdAt"}
        }
    }, {
        $sort: {"createdAt": -1}
    }, {
        $group: {
            _id: {
                city: "$LocationId", itemType: "$ItemTypeId", date: {
                    $dateToString: {
                        format: "%Y-%m-%dT%H:00:00", date: "$_id"
                    }
                }
            },
            averagePrice: {$avg: "$UnitPriceSilver"},
            amount: {$sum: "$Amount"},
            stdPrice: {$stdDevSamp: "$UnitPriceSilver"},
            minPrice: {$min: "$UnitPriceSilver"},
            maxPrice: {$max: "$UnitPriceSilver"}
        }
    }, {
        $group: {
            _id: {
                city: "$_id.city", itemType: "$_id.itemType"
            }, hourlyAverages: {
                $push: {
                    date: "$_id.date",
                    averagePrice: "$averagePrice",
                    amount: "$amount",
                    stdPrice: "$stdPrice",
                    minPrice: "$minPrice",
                    maxPrice: "$maxPrice",
                }
            }
        }
    }, {
        $project: {
            _id: 0, city: "$_id.city", itemType: "$_id.itemType", hourlyAverages: 1
        }
    }, {
        $sort: {
            "_id.city": 1
        }
    }]).toArray()
}
