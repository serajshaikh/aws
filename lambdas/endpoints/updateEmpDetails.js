const Responses = require('../apis/API_Responses');
const Dynamo = require('../apis/Dynamodb');

const tableName = process.env.tableName;

exports.handler = async event => {
    console.log('event', event);
    const body=JSON.parse(event.body);
    const objKeys = Object.keys(body);
    if (!event.pathParameters || !event.pathParameters.ID) {
        // failed without an ID
        return Responses._Error400({ message: 'missing the ID from the path' });
    }

    let ID = event.pathParameters.ID;

    const user = await Dynamo.updateItem(ID, tableName, body, objKeys).catch(err => {
        console.log('error occurred updating item into table', err);
        return null;
    });

    if (!user) {
        return Responses._Error400({ message: 'Failed to Update user by ID' });
    }

    return Responses._Ok200({ user });
};
