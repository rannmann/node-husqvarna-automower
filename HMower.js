const request = require('request');

// Mower-holding objects
function HMower(mower, trackUrl, headers) {
    this.trackUrl = trackUrl;
    this.headers = headers;
    this.mower = mower;
    this.command = {
        park: 'PARK',
        stop: 'STOP',
        start: 'START'
    };
}

HMower.prototype.status = function (callback) {
    request({
        url: this.trackUrl + 'mowers/' + this.mower.id + '/status',
        method: "GET",
        headers: this.headers
    }, function (error, response, body) {
        if (error || response.statusCode !== 200) {
            callback(error, response);
        } else {
            callback(error, response, JSON.parse(body));
        }
    });
}

HMower.prototype.geoStatus = function (callback) {
    request({
        url: this.trackUrl + 'mowers/' + this.mower.id + '/geofence',
        method: "GET",
        headers: this.headers
    }, function (error, response, body) {
        if (error || response.statusCode !== 200) {
            callback(error, response);
        } else {
            callback(error, response, JSON.parse(body));
        }
    });
}

// Untested.
HMower.prototype.control = function (command, callback) {
    if (!this.command.hasOwnProperty(command)) {
        console.log('Unknown Command: ' + command);
    }
    request({
        url: this.trackUrl + 'mowers/' + this.mower.id + '/control',
        method: "POST",
        headers: this.headers,
        body: {
            action: this.command[command]
        }
    }, callback);
}

module.exports = HMower;