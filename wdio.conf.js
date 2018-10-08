exports.config = {
    specs: [
        __dirname + '/tests/**'
    ],
    exclude: [],
    maxInstances: 10,
    capabilities: [{
            browserName: 'chrome',
            chromeOptions: {
                args: ['--disable-gpu']
            }
        },
        {
            browserName: 'firefox',
            marionette: true,
            "moz:firefoxOptions": {
                "binary": "C:\\Program Files\\Mozilla Firefox\\firefox.exe"
            },
        }
    ],
    sync: true,
    logLevel: 'silent',
    coloredLogs: true,
    deprecationWarnings: true,
    bail: 0,
    screenshotPath: './errorShots/',
    baseUrl: 'https://the-internet.herokuapp.com/',
    waitforTimeout: 10000, // Default timeout for all waitFor* commands.
    connectionRetryTimeout: 90000,
    connectionRetryCount: 3,
    services: ['selenium-standalone'],
    port: 4444,
    path: '/wd/hub',
    chromeDriverLogs: './logs',
    framework: 'mocha',
    reporters: ['dot'],
    mochaOpts: {
        ui: 'bdd',
        timeout: 30000
    },
    before: function () {
        var chai = require('chai');
        global.expect = chai.expect;
        chai.should();
    }
}