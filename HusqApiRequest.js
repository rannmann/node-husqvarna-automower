const EventEmitter = require('events');
const request = require("request");
const HMower = require("./HMower");

class HusqApiRequest extends EventEmitter {
    constructor() {
        super(); // idk what this is for yet
        this.authUrl = 'https://iam-api.dss.husqvarnagroup.net/api/v3/';
        this.trackUrl = 'https://amc-api.dss.husqvarnagroup.net/v1/';
        this.headers = {
            "Content-type": "application/json",
            "Accept": "application/json"
        };
        this.robots = []; // Array of HMowers

        this.token = null;
        this.provider = null;
        this.loginExpiry = null;
        this.loginExpires = null;
        this.mower_id = null;
        this.minStatusInterval = 30;

    }

    login(username, password) {
        request({
            url: this.authUrl + 'token',
            method: "POST",
            json: true,
            headers: this.headers,
            body: {
                data: {
                    type: "token",
                    attributes: {
                        username: username,
                        password: password,
                    }
                }
            }
        }, (error, response, body) => {
            if (!error && response.statusCode === 200) {
                console.log(body)
            } else if (error) {
                console.log("error: " + error);
                console.log("response.statusCode: " + response.statusCode);
                console.log("response.statusText: " + response.statusText);
            } else {
                if (body.errors) {
                    body.errors.forEach(function (e) {
                        console.log('(' + e.status + ') ' + e.title + ': ' + e.detail);
                    });
                } else {
                    this.token = body.data.id;
                    this.provider = body.data.attributes.provider;
                    this.loginExpiry = body.data.attributes.expires_in;
                    this.loginExpires = new Date() + body.data.attributes.expires_in;
                    this.headers.Authorization = "Bearer " + body.data.id;
                    this.headers['Authorization-Provider'] = body.data.attributes.provider;

                    this.emit('login');
                }
            }
        });
    }

    logout() {
        // TODO, send DELETE request to authUrl + token/{this.token}
        this.token = null;
        this.headers.Authorization = null;
    }

    getMowers() {
        var mowers = [];
        var HMowers = [];
        request({
            url: this.trackUrl + 'mowers',
            headers: this.headers,
            method: "GET"
        }, (error, response, body) => {
            if (error) {
                console.log(error);
            } else if (response.statusCode !== 200) {
                console.log(response.statusCode);
                console.log(response.statusText);
            } else {
                mowers = JSON.parse(body);
                mowers.forEach((m) => {
                    var mower = new HMower(m, this.trackUrl, this.headers);
                    this.robots.push(mower);
                });
                this.emit("mowerUpdate", this.robots);
            }
        });
    }
}

module.exports = HusqApiRequest;