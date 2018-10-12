exports.config = {
    specs: [
        __dirname + '/tests/**'
    ],
    exclude: [],
    maxInstances: 10,
     capabilities: [
         {
            browserName: 'chrome',
            chromeOptions: {
                args: ['--headless']
            }
         },
        // {
        //     browserName: 'firefox',
        //     marionette: true,
        //     "moz:firefoxOptions": {
        //         "binary": "C:\\Program Files\\Mozilla Firefox\\firefox.exe"
        //     }
        // }
    ],
    sync: true,
    logLevel: 'verbose',
    logDir: __dirname,
    coloredLogs: true,
    deprecationWarnings: true,
    bail: 0,
    screenshotPath: './errorShots/',
    baseUrl: 'https://the-internet.herokuapp.com',
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
        timeout: 30000,
        compilers: ['js:babel-register']
    },
    before: function () {
        var chai = require('chai');
        global.chai = chai;
        global.expect = chai.expect;
        chai.should();

        var chaiHttp = require('chai-http');
        chai.use(chaiHttp);

        var chaiURL = require('chai-url');
        chai.use(chaiURL);
    }
}