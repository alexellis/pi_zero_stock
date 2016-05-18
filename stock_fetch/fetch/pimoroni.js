"use strict"

class PimoroniScrape {
  constructor() {
    modules.modules=modules;
    this.productPage = "https://shop.pimoroni.com/products/raspberry-pi-zero.js";
  }

  _pullCounts(url) {
    return new Promise((resolve, reject) => {
      this.modules.request.get({url: url, "User-Agent": "pi-check", "json": true}, (err, response, body) => {
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
          resolve(0);
        }
        resolve(total);
      });
    });
  }

  refresh(done) {
    var stock = {};
    var total = 0;
    Promise.all([
      this._pullCounts(this.productPage ),
      this._pullCounts("https://shop.pimoroni.com/products/pi-zero-complete-starter-kit.js"),
      this._pullCounts("https://shop.pimoroni.com/products/pi-zero-project-kits.js")
    ]).then((results) => {
      results.forEach((r)=> {
        total+=r;
      });
      done(null, {stock: total>0, totalAmount: total});
    });
  }
}

module.exports = PimoroniScrape;
