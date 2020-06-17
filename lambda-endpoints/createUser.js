'use strict';
const Responses = require('../common/API_Response');
const Dynamo = require('../common/Dynamo');

exports.handler = async event => {
    console.log('event', event);

    if (!event.pathParameters || !event.pathParameters.ID) {
        // failed without an ID
        return Responses._400({ message: 'missing the ID from the path' });
    }

    let ID = event.pathParameters.ID;
    let tableName = 'user';
    const user = JSON.parse(event.body);
    user.ID = ID;


    const newUser = await Dynamo.write(user, tableName).catch(err => {
        console.log('error in dynamo write', err);
        return null;
    });

    if (!newUser) {
        return Responses._400({ message: 'Failed to write light user by ID' });
    }

    return Responses._200({ newUser: newUser });
};
