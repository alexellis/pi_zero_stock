"use strict"

const Redis = require('redis');
const request = require('request');

const Pihut = require("./fetch/pihut");
const Keywordfinder = require("./fetch/keywordfinder");

function main() {
  const subscribe = Redis.createClient();
  const push = Redis.createClient();
  const pihut = new Pihut();
  const pimoroni = new Keywordfinder("https://shop.pimoroni.com/collections/raspberry-pi");
  const pisupply = new Keywordfinder("https://www.pi-supply.com/product/raspberry-pi-zero-cable-kit/");
  const cacheSeconds = 5;

  subscribe.on("message", (channel, message) => {
    if(channel == "stock") {
      var mappings= {
        "pihut" : pihut,
        "pisupply": pisupply,
        "pimoroni": pimoroni
      };

      if(Object.keys(mappings).indexOf(message) > -1) {
        var handler = mappings[message];

        push.get(message + ".stock", (getStockErr, stockVal) => {
          if(!stockVal) {
            handler.refresh((refreshErr, val)=> {
              console.log(message+ " refreshed");
              push.set(message+".stock", (val? 1 : 0), (err) => {
                push.expire(message+".stock", cacheSeconds, (err) => {
                  console.log("Stock expiring in "+cacheSeconds+" secs.");
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
