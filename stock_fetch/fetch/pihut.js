"use strict"

var request = require('request');

module.exports = class Pimoroni {

  constructor() {

  }

  refresh(done) {
    const collectionUrl = "https://thepihut.com/products/raspberry-pi-zero?variant=14062715972";
    request.get({url: collectionUrl, "User-Agent": "pi-check"}, (err, response, body) => {
      var lines = body.split("\n");
      lines.forEach(function(line) {
        if(line.indexOf("product: {") >- 1) {
          let processLine = line.replace("product", "\"product\"").trim();

          processLine = "{" + processLine.substring(0,processLine.length-1) + "}";
          let parsed = JSON.parse(processLine);
          var found = false;
          parsed.product.variants.forEach(function(variant) {
            if(variant.inventory_quantity) {
              found = true;
            }
          });

          done(err, found);
        }
      });
    });
  }
}
