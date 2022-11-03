const Responses = require('../apis/API_Responses');
const Dynamo = require('../apis/Dynamodb');

const tableName = process.env.tableName;

exports.handler = async event => {
    console.log('event', event);

    if (!event.pathParameters || !event.pathParameters.ID) {
        // failed without an ID
        return Responses._Error400({ message: 'missing the ID from the path' });
    }

    let ID = event.pathParameters.ID;

    const user = await Dynamo.get(ID, tableName).catch(err => {
        console.log('error in Dynamo Get', err);
        return null;
    });

    if (!user) {
        return Responses._Error400({ message: 'Failed to get user by ID',error:user });
    }

    return Responses._Ok200({ user });
};
