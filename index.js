"use strict";
const HusqApiRequest = require('./HusqApiRequest');
const config = require('./config');

let api = new HusqApiRequest();

// Setup our event listeners

// After API login
api.on('login', () => {
    console.log("Logged on. Checking for mowers.");
    // Get a list of mowers belonging to this account
    api.getMowers();
});

// After API logout
api.on('logout', () => {
    console.log("Logged off.");
});

// When we get our intial list of mowers
// mowers = array of HMower objects
api.on('mowerUpdate', (mowers) => {
    console.log("Found " + mowers.length + " mower(s)");

    if (mowers.length > 0) {
        let mower = mowers[0];

        console.log("Getting mower Status");
        mower.getStatus(function (err, res, status) {
            status.lastLocations = null;
            console.log("Mower status:");
            console.log(status);
        });

        console.log("Getting mower GeoFence Status");
        mower.getGeoStatus(function (err, res, status) {
            console.log("Mower GeoFence Status:");
            console.log(status);
        });

        console.log("Sending command to park the mower");
        mower.sendCommand(mower.command.park, (err, msg) => {
            if (err) {
                console.log(msg);
            } else {
                console.log("Parked the mower");
            }
        });
    }
});

// Login and start this sucka'
api.login(config.username, config.password);
