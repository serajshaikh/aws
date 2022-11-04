// **************************** DynamoDB Client - AWS SDK for JavaScript v3 ****************************

const db = require("./db");
const {GetItemCommand, PutItemCommand, DeleteItemCommand, ScanCommand, UpdateItemCommand,} = require("@aws-sdk/client-dynamodb");
const { marshall, unmarshall } = require("@aws-sdk/util-dynamodb");

const Dynamo = {
    async get(ID, TableName) {
        const response = { statusCode: 200 };

        try {
            const params = {
                TableName: TableName,
                Key: marshall({ ID: ID }),
            };
            const { Item } = await db.send(new GetItemCommand(params));

            console.log({ Item });
            return unmarshall(Item);
        } catch (e) {
            console.error(e);
            return `There was an error fetching the data for ID of ${ID} from ${TableName}`;
        }

    },

    async write(data, TableName) {
        if (!data.ID) {
            throw Error('no ID on the data');
        }
        try {
            const params = {
                TableName: TableName,
                Item: marshall(data),
            };
            await db.send(new PutItemCommand(params));
            return data;
        } catch (e) {
            console.error(e);
            return `Error Putting data into table id is ${ID} from ${TableName} error is ${e}`
        }

    },

    async deleteItem(ID, TableName) {
        try {
            const params = {
                TableName: TableName,
                Key: marshall({ ID: ID }),
            };
            const deletedItem = await db.send(new DeleteItemCommand(params));
            return deletedItem;
        } catch (e) {
            console.error(e);
            return `Error Putting data into table id is ${ID} from ${TableName} error is ${e}`
        }

    },

    async updateItem(ID, TableName, body, objKeys) {

        try {
            console.log("Body Element is ", body);
            console.log("objectKeys are:", objKeys);
            const params = {
                TableName: TableName,
                Key: marshall({ ID: ID }),
                UpdateExpression: `SET ${objKeys.map((_, index) => `#key${index} = :value${index}`).join(", ")}`,
                ExpressionAttributeNames: objKeys.reduce((acc, key, index) => ({
                    ...acc,
                    [`#key${index}`]: key,
                }), {}),
                ExpressionAttributeValues: marshall(objKeys.reduce((acc, key, index) => ({
                    ...acc,
                    [`:value${index}`]: body[key],
                }), {})),
            };
            const updatedItem = await db.send(new UpdateItemCommand(params));
            return updatedItem;
        } catch (e) {
            console.error(e);
            return `Error Putting data into table id is ${ID} from ${TableName} error is ${e}`
        }

    },
    async listAItem(ID, TableName) {
        try {
            const params = {
                TableName: TableName
            };
            const allListedItem = await db.send(new ScanCommand(params));
            return allListedItem.Items.map((item) => unmarshall(item));
        } catch (e) {
            console.error(e);
            return `Error Putting data into table id is ${ID} from ${TableName} error is ${e}`
        }

    },
};
module.exports = Dynamo;



// **************************** DynamoDB - AWS SDK for JavaScript v2 ****************************
/* const AWS = require('aws-sdk');

const documentClient = new AWS.DynamoDB.DocumentClient();

const Dynamo = {
    async get(ID, TableName) {
        const params = {
            TableName,
            Key: {
                ID,
            },
        };

        const data = await documentClient.get(params).promise();

        if (!data || !data.Item) {
            throw Error(`There was an error fetching the data for ID of ${ID} from ${TableName}`);
        }
        console.log(data);

        return data.Item;
    },

    async write(data, TableName) {
        if (!data.ID) {
            throw Error('no ID on the data');
        }

        const params = {
            TableName,
            Item: data,
        };

        const res = await documentClient.put(params).promise();

        if (!res) {
            throw Error(`There was an error inserting ID of ${data.ID} in table ${TableName}`);
        }

        return data;
    },
};
module.exports = Dynamo;
 */