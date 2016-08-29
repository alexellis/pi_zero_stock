"use strict"

class PimoroniScrape {
  constructor(modules) {
    this.modules = modules;
  }

  _pullCounts(url) {

    return new Promise((resolve, reject) => {
      
      let options = {
        url: url,
        headers: {          
          "User-Agent": "stockalert.alexellis.io",
        },
        "json": true
      }; 

      this.modules.request.get(options, (err, response, body) => {
        let total = 0;
        try {
          if(body && body.product && body.product.variants) {
            body.product.variants.forEach((v) => {
               if(v.inventory_quantity) {
                 let val = Number(v.inventory_quantity);
                 if(val > 0 && v.price > 0) {
                    total += val;
                 }
               }
            });
          }
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
    var urls = [
      "https://shop.pimoroni.com/products/raspberry-pi-zero.json",
      "https://shop.pimoroni.com/products/pi-zero-complete-starter-kit.json",
      "https://shop.pimoroni.com/products/pi-zero-project-kits.json",
      "https://shop.pimoroni.com/products/pi-zero-cctv-kit-little-bro.json"
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
