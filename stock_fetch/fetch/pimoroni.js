"use strict"

class PimoroniScrape {
  constructor(modules) {
    this.modules = modules;
  }

  _pullCounts(url) {
      return new Promise((resolve, reject) => {
        this.modules.request.get({url: url, "User-Agent": "pi-check", "json": true}, (err, response, body) => {
          if(err) {
            console.error(err);
            return resolve(0);
          }

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
            return resolve(0);
          }
          return resolve(total);
        });
    });
  }

  refresh(done) {
    var stock = {};
    var total = 0;
    var urls = [
      "https://shop.pimoroni.com/products/raspberry-pi-zero.js",
      "https://shop.pimoroni.com/products/pi-zero-complete-starter-kit.js",
      "https://shop.pimoroni.com/products/pi-zero-project-kits.js"
    ];
    var promises = [];
    urls.forEach((url)=> {
      promises.push(this._pullCounts(url));
    });
 
    Promise.all(promises)
    .then((results) => {

      results.forEach((r)=> {
        total+=r;
      });
      done(null, {stock: total>0, totalAmount: total});
    })
    .catch((e) => {
      console.error(e);
      done(null, {stock: total>0, totalAmount: total});
    });
  }
}

module.exports = PimoroniScrape;