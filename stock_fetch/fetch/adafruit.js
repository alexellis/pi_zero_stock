"use strict"

class Adafruit {
  constructor(modules, products, url) {
    this.modules = modules;
    this.zeroProducts  = products;
    this.url = url;
  }

  _scrape($) {
    let rows = $(".product-listing a");

    let zeroProducts = this.zeroProducts;
    let stock = false;
    if(rows) {

      rows.each((i, r)=> {
        if(r && r.attribs && r.attribs["data-pid"] && 
          zeroProducts.indexOf(r.attribs["data-pid"]) > -1) {

          let isImageLink = false;
          r.children.forEach((ch) => {
            if(ch.type != "text") {
              isImageLink = true;
            }
          });

          if(!isImageLink) {
            // console.log("PI Zero found - " + r.attribs['data-name'])
            // console.log(r.attribs["data-pid"]);
            if(r.parent && r.parent.parent && r.parent.parent.parent) {
              var available = $(r.parent.parent.parent).html().indexOf("out-of-stock") == -1;
              if(available) {
                stock = true;
              }
            }
          }
        }
      });
    }

    return stock;
  }

  refresh(done) {
    this.modules.request.get(this.url, (err, res, body) => { 
      let stock = false;
      if(err) {
        console.error(err);
      }

      if(res.status==200) {
        try { 
          let $ = this.modules.cheerio.load(body);
          if($) {
            stock = this._scrape($);
          }
        }
        catch (e) {
          console.error(e);
        }
      }

      done(err, {stock:stock});
    });
  }
}

module.exports = Adafruit;
