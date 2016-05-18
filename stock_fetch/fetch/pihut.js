"use strict"

module.exports = class Pihut {

  constructor(modules) {
    this.modules = modules;
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
          
          if(parsed && parsed.product && parsed.product.variants) {
            parsed.product.variants.forEach(function(variant) {
              if(variant.inventory_quantity) {
                let value = Number(variant.inventory_quantity);
                totalAmount = (value > 0) ? value : 0;
              }
            });
          }
        }
      });
    } catch(e) {
      console.error(e);
    }
    return {stock: totalAmount > 0, totalAmount: totalAmount};
  }

  refresh(done) {
    const collectionUrl = "https://thepihut.com/products/raspberry-pi-zero?variant=14062715972";
    this.modules.request.get({url: collectionUrl, "User-Agent": "pi-check"}, (err, response, body) => {
      if(err) {
        console.error(err);
        return done(err);
      }

      var found = this._process(response, body);
      done(err, found);
    });
  }
}

