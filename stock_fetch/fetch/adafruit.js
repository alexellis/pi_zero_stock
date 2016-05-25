"use strict"

class Adafruit {
  constructor(modules, products, url) {
    this.modules = modules;
    this.zeroProducts  = products;
    this.url = url;
  }

  refresh(done) {
    this.modules.request.get(this.url, (err,res,body)=> {
      let $ = this.modules.cheerio.load(body);
      let rows = $(".product-listing a");

      let zeroProducts = this.zeroProducts;
      let stock = false;

      rows.each((i, r)=> {
        if(zeroProducts.indexOf(r.attribs["data-pid"]) > -1) {
          let isImageLink = false;
          r.children.forEach((ch)=>{
            if(ch.type != "text") {
              isImageLink = true;
            }
          });

          if(!isImageLink) {
            // console.log("PI Zero found - " + r.attribs['data-name'])
            // console.log(r.attribs["data-pid"]);
            var available = $(r.parent.parent.parent).html().indexOf("out-of-stock") == -1;
            if(available) {
              stock = true;
            }
          }
        }
      });

      done(err, {stock:stock});
    });
  }
}

module.exports = Adafruit;
