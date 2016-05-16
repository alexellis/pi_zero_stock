"use strict"

var request = require('request');

module.exports = class Keywordfinder {
  constructor(productPage) {
    this.productPage = productPage;
    this.keyword = "stock-level in-stock";
  }

  refresh(done) {
    request.get({url: this.productPage, "User-Agent": "pi-check"}, (err, response, body) => {
      let stock = false;
      try {
        stock = body.indexOf(this.keyword) >=0;
      } catch(e) {
        console.error(e);
      }
      done(err, {stock: stock});
    });
  }
}

