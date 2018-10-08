// Common to all pages.
class Footer {

    constructor() {}

    get horizontalBar() {
        return browser.element('div#page-footer hr');
    }
    get footerText() {
        return browser.element('div#page-footer div > div');
    }

    checkHorizontalBar() {
        return browser.element('div#page-footer hr');
    }

    checkFooterText() {
        this.footerText.getText().should.contain('Powered by');
    }
}

module.exports = Footer;