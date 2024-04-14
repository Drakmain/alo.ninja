const options = {
    year: 'numeric',
    month: 'numeric',
    day: 'numeric',
    hour: 'numeric',
    minute: 'numeric',
    second: 'numeric',
    timeZone: 'Europe/Paris'
};

export async function getItems(itemsListItemsListCollection, item) {

    return await itemsListItemsListCollection.find({
        "_id": {
            $regex: item, $options: "i"
        }
    }).sort({"_id": 1}).toArray();
}
