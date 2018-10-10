import Page from './page'
var request = require("request");
class LoginPage extends Page {

  constructor() {
    super();
  }

  get title() {
    return browser.element('//h2');
  }

  get username() {
    return browser.element("//input[@name='username']");
  }

  get password() {
    return browser.element("//input[@name='password']");
  }

  get loginButton() {
    return browser.element('//button[contains(., "Login")]');
  }

  get loginDiv() {
    return browser.element('div#flash');
  }

  get flash() {
    return $('#flash')
  }

  open() {
    super.open('login') //this will append `login` to the baseUrl to form complete URL
  }

  getTitle() {
    this.title;
  }

  checkTitleText() {
    this.title.getText().should.be.equal('Login Page');
  }

  waitForloginPageToLoad() {
    if (!this.username.isVisible()) {
      this.username.waitForVisible();
    }
  }

  enterLoginValues(username, password) {
    this.waitForloginPageToLoad();
    this.username.setValue(username);
    this.password.setValue(password);
  }

  clickLoginBtn() {
    this.loginButton.click();
    browser.pause(2000);
  }
}

export default new LoginPage();