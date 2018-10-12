import LoginPage from '../page_objects/login.page';
import SecureAreaPage from '../page_objects/secure.area.page';
var chai = require('chai'),
    chaiHttp = require('chai-http');
chai.use(chaiHttp);

var request = require('request');

// Valid user
const username = 'tomsmith';
const password = 'SuperSecretPassword!'

// Flash messages
const LOGIN_SUCCESS_MSG = 'You logged into a secure area!';
const LOGOUT_SUCCESS_MSG = 'You logged out of the secure area!';
const USERNAME_INVALID_MSG = 'Your username is invalid!';
const PASSWORD_INVALID_MSG = 'Your password is invalid!';
const MUST_LOGIN_MSG = 'You must login to view the secure area!';

describe('The Internet website - ', () => {
    xit('form authentication without Page Objects', () => {
        browser.url('/login')
            .setValue('input#username', username)
            .setValue('input#password', password)
            .click('form#login i')
            .getTitle().should.be.equal('The Internet');
        browser.waitForVisible('div#flash');
        browser.getText('div#flash').should.contain(LOGIN_SUCCESS_MSG);
        browser.click('div#content a > i');
    });

    xit('can login with valid credentials', () => {
        LoginPage.open();
        LoginPage.checkTitleText();
        LoginPage.enterLoginValues(username, password);
        LoginPage.clickLoginBtn();

        SecureAreaPage.flash.waitForVisible();
        SecureAreaPage.flash.getText().should.contain(LOGIN_SUCCESS_MSG);
    });

    xit('cannot login with an invalid username', () => {
        LoginPage.open();
        LoginPage.checkTitleText();
        LoginPage.enterLoginValues('invalid', password);
        LoginPage.clickLoginBtn();

        LoginPage.flash.waitForVisible();
        LoginPage.flash.getText().should.contain(USERNAME_INVALID_MSG);
    });

    xit('cannot login with an invalid password', () => {
        LoginPage.open();
        LoginPage.checkTitleText();
        LoginPage.enterLoginValues(username, 'invalid');
        LoginPage.clickLoginBtn();

        LoginPage.flash.waitForVisible();
        LoginPage.flash.getText().should.contain(PASSWORD_INVALID_MSG);
    });

    xit('cannot access Secure Area without logging in', () => {
        SecureAreaPage.open();
        SecureAreaPage.logout();
        SecureAreaPage.open();

        SecureAreaPage.flash.waitForVisible();
        SecureAreaPage.flash.getText().should.contain(MUST_LOGIN_MSG);
    })

    it('can log out', () => {

        var rackCookie = '';
        var rackSessionValue = '';
        LoginPage.open();

        browser.call(() => {
            return chai.request.agent('https://the-internet.herokuapp.com')
                .post('/authenticate')
                .set('content-type', 'application/x-www-form-urlencoded')
                .send({
                    username: 'tomsmith',
                    password: 'SuperSecretPassword!'
                })
                .then((res) => {
                    console.log(res)
                    expect(res).to.have.cookie('rack.session');
                    rackCookie = res.headers['set-cookie'][0];
                    rackSessionValue = rackCookie.split('rack.session=').pop().split(';')[0];
                    console.log('***' + rackSessionValue);
                })
        })

        browser.pause(10000) // wait for 10s to give me time to open chrome dev tools.

        // *** FIRST APPROACH TO SET COOKIE
        browser.setCookie({
            name: 'rack.session',
            value: rackSessionValue,
             httpOnly: true,
             secure: false, 
        });

        // *** SECOND APPROACH TO SET COOKIE
        // browser.cookie('post', {
        //     name: 'rack.session',
        //     value: rackSessionValue,
        //     httpOnly: true,
        //     //secure: false,
        // });

        // *** THIRD APPROACH TO SET COOKIE
        //browser.execute("document.cookie = " + rackCookie)

        // LOG OUT THE COOKIES
        var cookies = browser.getCookie();
        console.log('#####' + JSON.stringify(cookies));

        //    browser.refresh();
        //    browser.refresh();
        SecureAreaPage.open();
        browser.pause(2000);
        SecureAreaPage.logout();

        // LoginPage.flash.waitForVisible();
        // LoginPage.flash.getText().should.contain(LOGOUT_SUCCESS_MSG);
    })

    xit('can log out', () => {

        var rackSessionCookie = '';
        LoginPage.open();

        browser.call(() => {
            request.post({
                url: 'https://the-internet.herokuapp.com/authenticate',
                form: {
                    key: 'tomsmith',
                    password: 'SuperSecretPassword!'
                }
            }, function (err, res, body) {
                expect(res).to.have.cookie('rack.session');
                var cookie = res.headers['set-cookie'][0];
                rackSessionCookie = cookie.split('rack.session=').pop().split(';')[0];
            })
        })
        browser.url('/login');
        browser.setCookie({
            name: 'rack.session',
            value: rackSessionCookie,
            domain: '.the-internet.herokuapp.com'
        });

        // browser.cookie('post', {
        //     name: 'rack.session',
        //     value: rackSessionCookie,
        //     path: '/',
        //     domain: '.the-internet.herokuapp.com',
        //     secure: true
        // });

        SecureAreaPage.open();
        browser.pause(50000);
        SecureAreaPage.logout();
    })
});