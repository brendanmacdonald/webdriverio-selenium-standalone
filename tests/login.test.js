import LoginPage from '../page_objects/login.page';
import SecureAreaPage from '../page_objects/secure.area.page';

// Valid user
const username = 'tomsmith';
const password = 'SuperSecretPassword!'

// Flash messages
const LOGIN_SUCCESS_MSG = 'You logged into a secure area!';
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

    it('Set cookie version 1', () => {

        browser.url('http://testing-ground.scraping.pro/login');

        browser.call(async () => {
            return chai.request.agent('http://testing-ground.scraping.pro')
                .post('/login?mode=login')
                .set('content-type', 'application/x-www-form-urlencoded')
                .send({
                    usr: 'admin',
                    pwd: '12345',
                    mode: 'login'
                })
                .then((res) => {
                    expect(res).to.have.status(200);
                })
        })

        // Set the cookie.
        browser.setCookie({
            name: 'tdsess',
            value: 'TEST_DRIVE_SESSION',
            domain: 'testing-ground.scraping.pro',
            path: '/'
        });

        browser.url('http://testing-ground.scraping.pro/login?mode=welcome');
        expect(browser.getUrl()).to.contain.path('?mode=welcome');
        expect(browser.getText('#case_login')).to.contain('WELCOME :)');
    })

    it('Set cookie version 2', () => {

        browser.url('http://testing-ground.scraping.pro/login');

        browser.call(async () => {
            return chai.request.agent('http://testing-ground.scraping.pro')
                .post('/login?mode=login')
                .set('content-type', 'application/x-www-form-urlencoded')
                .send({
                    usr: 'admin',
                    pwd: '12345',
                    mode: 'login'
                })
                .then((res) => {
                    expect(res).to.have.status(200);
                })
        })

        // Set the cookie.
        browser.cookie('post', {
            name: 'tdsess',
            value: 'TEST_DRIVE_SESSION',
            domain: 'testing-ground.scraping.pro',
            path: '/'
        });

        browser.url('http://testing-ground.scraping.pro/login?mode=welcome');
        expect(browser.getUrl()).to.contain.path('?mode=welcome');
        expect(browser.getText('#case_login')).to.contain('WELCOME :)');
    })

    it('Cookie not set - fails to login', () => {

        browser.url('http://testing-ground.scraping.pro/login');

        browser.call(async () => {
            return chai.request.agent('http://testing-ground.scraping.pro')
                .post('/login?mode=login')
                .set('content-type', 'application/x-www-form-urlencoded')
                .send({
                    usr: 'admin',
                    pwd: '12345',
                    mode: 'login'
                })
                .then((res) => {
                    expect(res).to.have.status(200);
                })
        })

        browser.url('http://testing-ground.scraping.pro/login?mode=welcome');
        expect(browser.getUrl()).to.contain.path('?mode=welcome');
        expect(browser.getText('#case_login')).to.contain('THE SESSION COOKIE IS MISSING OR HAS A WRONG VALUE!');
    })
});