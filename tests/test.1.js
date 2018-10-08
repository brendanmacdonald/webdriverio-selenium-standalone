const LoginPage = require('../page_objects/login.page');
const SecureAreaPage = require('../page_objects/secure.area.page');

const username = 'tomsmith';
const password = 'SuperSecretPassword!'

describe('The Internet', () => {
    it('form authentication without Page Objects', () => {
        browser.url('/login');
        browser.setValue('input#username', username);
        browser.setValue('input#password', password);
        browser.click('form#login i');
        browser.getTitle().should.be.equal('The Internet');
        browser.isVisible('div#flash');
        browser.getText('div#flash').should.contain('You logged into a secure area!');
        browser.click('div#content a > i');
    });

    it('form authentication with Page Objects', () => {
        LoginPage.open();

        LoginPage.checkHorizontalBar();
        LoginPage.checkFooterText();

        LoginPage.checkTitleText();
        LoginPage.login(username, password);

        SecureAreaPage.verifyLoginSuccess();
        SecureAreaPage.checkHorizontalBar();
        SecureAreaPage.checkFooterText();
        SecureAreaPage.logout();
    });

    it('cannot access Secure Area without logging in', () => {
        SecureAreaPage.open();
        LoginPage.verifyLoginBlocked();
    })
});