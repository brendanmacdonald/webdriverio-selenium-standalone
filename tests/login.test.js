import LoginPage from '../page_objects/login.page';
import SecureAreaPage from '../page_objects/secure.area.page';
var chai = require('chai'),
    chaiHttp = require('chai-http');
chai.use(chaiHttp);

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
    it('form authentication without Page Objects', () => {
        browser.url('/login')
            .setValue('input#username', username)
            .setValue('input#password', password)
            .click('form#login i')
            .getTitle().should.be.equal('The Internet');
        browser.waitForVisible('div#flash');
        browser.getText('div#flash').should.contain(LOGIN_SUCCESS_MSG);
        browser.click('div#content a > i');
    });

    it('can login with valid credentials', () => {
        LoginPage.open();
        LoginPage.checkTitleText();
        LoginPage.enterLoginValues(username, password);
        LoginPage.clickLoginBtn();

        SecureAreaPage.flash.waitForVisible();
        SecureAreaPage.flash.getText().should.contain(LOGIN_SUCCESS_MSG);
    });

    it('cannot login with an invalid username', () => {
        LoginPage.open();
        LoginPage.checkTitleText();
        LoginPage.enterLoginValues('invalid', password);
        LoginPage.clickLoginBtn();

        LoginPage.flash.waitForVisible();
        LoginPage.flash.getText().should.contain(USERNAME_INVALID_MSG);
    });

    it('cannot login with an invalid password', () => {
        LoginPage.open();
        LoginPage.checkTitleText();
        LoginPage.enterLoginValues(username, 'invalid');
        LoginPage.clickLoginBtn();

        LoginPage.flash.waitForVisible();
        LoginPage.flash.getText().should.contain(PASSWORD_INVALID_MSG);
    });

    it('cannot access Secure Area without logging in', () => {
        SecureAreaPage.open();
        SecureAreaPage.logout();
        SecureAreaPage.open();

        SecureAreaPage.flash.waitForVisible();
        SecureAreaPage.flash.getText().should.contain(MUST_LOGIN_MSG);
    })

    it.only('can log out', () => {

        var rackSessionCookie = '';
        LoginPage.open();

        var initialRackSessionCookie = browser.getCookie('rack.session');

        browser.call(() => {
            return chai.request('https://the-internet.herokuapp.com')
                .post('/authenticate')
                .set('content-type', 'application/x-www-form-urlencoded')
                .set('Cookie', 'rack.session=' + initialRackSessionCookie.value)
                .send({
                    username: 'tomsmith',
                    password: 'SuperSecretPassword!'
                })
                .then((res) => {
                    expect(res).to.have.cookie('rack.session');
                    var cookie = res.headers['set-cookie'][0];
                    rackSessionCookie = cookie.split('rack.session=').pop().split(';')[0];
                })
        })

        browser.setCookie({
            name: 'rack.session',
            value: rackSessionCookie,
            path: '/',
            httpOnly: true,
            expiry: '1844259240'
        });

        SecureAreaPage.open();
        SecureAreaPage.logout();

        LoginPage.flash.waitForVisible();
        LoginPage.flash.getText().should.contain(LOGOUT_SUCCESS_MSG);

    })
});