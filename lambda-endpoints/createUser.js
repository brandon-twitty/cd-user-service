'use strict';
const Responses = require('../common/API_Response');
const Dynamo = require('../common/Dynamo');

const userTemplate = () => ({
	ID: null,
	phoneNumber: null,
	userId: null,
	messageAllowance: 100,

	// Return an array of properties that are null
	invalidProperties: () => this.keys().filter(v => this[v] == null)
});

exports.handler = async event => {
    console.log('event', event);

    if (!event.pathParameters || !event.pathParameters.ID) {
        // failed without an ID
        return Responses._400({ message: 'missing the ID from the path' });
    }

    let ID = event.pathParameters.ID;
    let tableName = 'user';
	const body = {...JSON.parse(event.body), ID: ID};
	const user = Object.assign(userTemplate(), body)
	const invalidProperties = user.invalidProperties();

	if (invalidProperties.length != 0)
	{
		console.log(`Invalid Properties for New User: ${invalidProperties} on user object: ${user}`);
		return Responses._400({ message: 'Invalid properties for user'});
	}

    const newUser = await Dynamo.write(user, tableName).catch(err => {
        console.log('error in dynamo write', err);
        return null;
    });

    if (!newUser) {
        return Responses._400({ message: 'Failed to write light user by ID' });
    }

    return Responses._200({ newUser: newUser });
};
