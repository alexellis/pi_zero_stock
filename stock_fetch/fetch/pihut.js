"use strict"

var request = require('request');

module.exports = class Pihut {

  constructor() {

  }

  _process(response, body) {
    var ret = {};
    var found = false;
    var totalAmount = 0;
    try {
      var lines = body.split("\n");

      lines.forEach(function(line) {
        if(line.indexOf("product: {") >- 1) {
          let processLine = line.replace("product", "\"product\"").trim();
          processLine = "{" + processLine.substring(0,processLine.length-1) + "}";
          let parsed = JSON.parse(processLine);
          parsed.product.variants.forEach(function(variant) {
            if(variant.inventory_quantity) {
              let value = Number(variant.inventory_quantity);
              if(value > 0) {
                 totalAmount = 0;
              }
            }
          });
        }
      });
    } catch(e) {
      console.error(e);
    }
    return {stock: totalAmount > 0, totalAmount: totalAmount};
  }

  refresh(done) {
    const collectionUrl = "https://thepihut.com/products/raspberry-pi-zero?variant=14062715972";
    request.get({url: collectionUrl, "User-Agent": "pi-check"}, (err, response, body) => {
      if(err) {
        console.error(err);
        return done(err, false);
      }

      var found = this._process(response, body);
      done(err, found);
    });
  }
}

