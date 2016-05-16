"use strict"

var request = require('request');

module.exports = class PimoroniScrape {
  constructor() {
    this.productPage = "https://shop.pimoroni.com/products/raspberry-pi-zero.js";
  }

  refresh(done) {
    request.get({url: this.productPage, "User-Agent": "pi-check", "json": true}, (err, response, body) => {
      let stock = {};
      let found = false;
      let total = 0;
      try {
        body.variants.forEach((v) => {
           if(v.inventory_quantity) {
             let val = Number(v.inventory_quantity);
             if(val > 0) {
                total += val;
             }
           }
        });
      } catch(e) {
        console.error(e);
      }
      done(err, {stock: total>0, totalAmount: total});
    });
  }
}

