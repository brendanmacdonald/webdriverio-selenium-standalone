import Page from './page'

class SecureAreaPage extends Page {

    constructor() {
        super();
    }


    get secureAreaDiv() {
        return browser.element('div#flash');
    }
    get logoutButton() {
        return browser.element('div#content a > i');
    }
    get flash() {
        return $('#flash')
    }

    open() {
        super.open('secure')
    }

    logout() {
        this.logoutButton.click();
    }
}

export default new SecureAreaPage();