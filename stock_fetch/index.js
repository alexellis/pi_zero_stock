"use strict"

const Redis = require('redis');
const request = require('request');

function main() {
  const subscribe = Redis.createClient();
  const push = Redis.createClient();

  subscribe.on("message", (channel, message) => {
    if(channel == "stock") {
      if(message == "pimoroni") {

        push.get("pimoroni.stock", (err, value) => {
          if(!value) {
            console.log("Fetching pimoroni stock")

            var collectionUrl = "https://shop.pimoroni.com/collections/raspberry-pi";
            request.get({url: collectionUrl, "User-Agent": "pi-check"}, (err, response, body) => {
              push.set("pimoroni.access", new Date().getTime(), (err) => {
                if(err) {
                  return console.error(err);
                }
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
            });
          }
        });
      }
    }
  });
  subscribe.subscribe("stock");
}

main();
