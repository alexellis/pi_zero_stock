"use strict"

var request = require('request');

module.exports = class Pimoroni {
  constructor(productPage) {
    this.productPage = productPage;
  }

  refresh(done) {
    request.get({url: this.productPage, "User-Agent": "pi-check"}, (err, response, body) => {
        let stock = body.indexOf("stock-level in-stock") >=0;
        done(err, stock);
    });
  }
}
