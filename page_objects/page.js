let mixin = require('xmultiple');
const Footer = require('../page_objects/common/footer');
const Flash = require('../page_objects/common/flash');

class Page extends mixin(Footer, Flash) {
  constructor() {
  }

  open(path) {
    browser.url(path)
  }
}

module.exports = Page;


