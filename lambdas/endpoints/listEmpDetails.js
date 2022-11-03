const Responses = require('../apis/API_Responses');
const Dynamo = require('../apis/Dynamodb');

const tableName = process.env.tableName;

exports.handler = async event => {
    console.log('event', event);

    if (!event.pathParameters || !event.pathParameters.tableName) {
        // failed without an ID
        return Responses._Error400({ message: 'missing the ID from the path' });
    }

    let UrlTableName = event.pathParameters.tableName;

    if (UrlTableName === tableName) {

        const user = await Dynamo.listAItem(tableName, tableName).catch(err => {
            console.log('error occurred updating item into table', err);
            return null;
        });

        if (!user) {
            return Responses._Error400({ message: 'Failed to Update user by ID' });
        }
        return Responses._Ok200({ user });

    }else{
        return Responses._Error400({message:"You Given Wrong Table Name"})
    }


};
