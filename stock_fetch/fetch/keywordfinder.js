"use strict"

module.exports = class Keywordfinder {
  constructor(modules, productPage) {
    this.modules = modules;
    this.productPage = productPage;
    this.keyword = "stock-level in-stock";
  }

  refresh(done) {
    let options = {
      url: this.productPage,
      headers: {          
        "User-Agent": "stockalert.alexellis.io",
      }
    };

    this.modules.request.get(options, (err, response, body) => {
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