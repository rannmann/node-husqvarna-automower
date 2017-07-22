const HusqApiRequest = require('./HusqApiRequest')
const config = require('./config');

var api = new HusqApiRequest();

// Setup our event listeners

// After API login
api.on('login', () => {
    console.log("Logged on. Checking for mowers.");
    // Get a list of mowers belonging to this account
    api.getMowers();
});

// After API logout
api.on('logout', function() {
    console.log("Logged off.");
});

// When we get our intial list of mowers
// mowers = array of HMower objects
api.on('mowerUpdate', (mowers) => {
    console.log("Found " + mowers.length + " mower(s)");

    console.log("Getting mower Status");
    mowers[0].status((err, res, status) => {
        console.log("Mower status:");
        console.log(status);
    });

    console.log("Getting mower GeoFence Status");
    mowers[0].geoStatus((err, res, status) => {
        console.log("Mower GeoFence Status:");
        console.log(status);
    });

    /* Untested.  I have no idea what this returns.
    mowers[0].control(api.command.stop, (err, res, status) => {
        console.log("Stopped the mower");
    });
    */
});

// Login and start this sucka'
api.login(config.username, config.password);
