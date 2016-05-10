"use strict"

const Redis = require('redis');
const request = require('request');

function main() {
  const subscribe = Redis.createClient();
  const push = Redis.createClient();

  subscribe.on("message", (channel, message) => {
    if(channel == "stock") {

      if(message == "pihut") {
        push.get("pihut.stock", (err, pihutstock)=> {
          if(!pihutstock) {

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
                  push.set("pihut.stock", found, (err) => {
                    push.expire("pihut.stock", 2, (err) => {

                    });
                  });
                }
              });
            });
          }
        });
      }
      else if(message == "pimoroni") {

        push.get("pimoroni.stock", (err, value) => {
          if(!value) {
            var collectionUrl = "https://shop.pimoroni.com/collections/raspberry-pi";
            request.get({url: collectionUrl, "User-Agent": "pi-check"}, (err, response, body) => {
                let stock = body.indexOf("stock-level in-stock") >=0;
                push.set("pimoroni.stock", stock, (err) => {
                  if(err) {
                    return console.error(err);
                  }
                  push.expire("pimoroni.stock", 2, (err) => {
                    if(err) {
                      console.error(err);
                    }
                  })
                });
            });
          }
        });
      }
    }
  });
  subscribe.subscribe("stock");
}

main();
