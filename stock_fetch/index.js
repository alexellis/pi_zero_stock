"use strict"

const Redis = require('redis');
const request = require('request');

const Pihut = require("./fetch/pihut");
const Pimoroni = require("./fetch/pimoroni");
const Keywordfinder = require("./fetch/keywordfinder");

function main() {
  const modules = {"request": request};

  const subscribe = Redis.createClient({host: process.env.REDIS||"redis"});
  const push = Redis.createClient({host: process.env.REDIS||"redis"});

  const pihut = new Pihut(modules);
  const pimoroni = new Pimoroni(modules);
  const pisupply = new Keywordfinder(modules,"https://www.pi-supply.com/product/raspberry-pi-zero-cable-kit/");

  const cacheMs = 60000;
  const cacheRefreshLockMs = 5000;
  const ifNotExists = "NX";
  const expire = "PX";

  var mappings = {
    "pihut": pihut,
    "pisupply": pisupply,
    "pimoroni": pimoroni
  };

  function getMapping(message) {
    var ret;
    if(Object.keys(mappings).indexOf(message) > -1) {
      ret = mappings[message];
    }
    return ret;
  }

  subscribe.on("message", (channel, message) => {
    if(channel == "stock") {
      var handler = getMapping(message);
      if(handler) {
        push.get(message + ".stock", (getStockErr, stockVal) => {
          if(!stockVal) {

            push.get(message + ".stock.fetching", (getfetchingErr, fetching) => {
              console.log(message + ".stock.fetching", fetching);
              if(fetching) {
                return;
              }

              console.log("Firing check to " + message);
              push.set(message + ".stock.fetching", true, ifNotExists, expire, cacheRefreshLockMs, (setFetchingErr) => {
                handler.refresh((refreshErr, val) => {
                  console.log(message+ " refreshed");
                  push.set(message+".stock", (val.stock ? 1 : 0), ifNotExists, expire, cacheMs, (err) => {
                    if(val.totalAmount) {
                       push.set(message+".totalAmount", val.totalAmount, ifNotExists, expire, cacheMs, (err) => {

                       });
                    }
                    push.publish("stock.refreshed", message);
                  });
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

