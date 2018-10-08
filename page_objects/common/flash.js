// Common to all pages.
class Flash {

    constructor() {}

    get flash() {
        return browser.element('div#flash');
    }

    checkTextInFlash(text) {
        this.flash.isVisible();
        this.flash.getText().should.contain(text);
    }
}

module.exports = Flash;