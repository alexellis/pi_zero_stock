"use strict"

const Redis = require('redis');
const request = require('request');
const cheerio = require('cheerio');

const Pihut = require("./fetch/pihut");
const Pimoroni = require("./fetch/pimoroni");
const Keywordfinder = require("./fetch/keywordfinder");
const Adafruit = require('./fetch/adafruit');

function main() {
  const modules = {"request": request, "cheerio": cheerio};

  const subscribe = Redis.createClient({host: process.env.REDIS || "redis"});
  const push = Redis.createClient({host: process.env.REDIS || "redis"});

  const pihut = new Pihut(modules);
  const pimoroni = new Pimoroni(modules);
  const adafruit = new Adafruit(modules, ["2816", "2817", "2885"], "https://www.adafruit.com/categories/813");

  const cacheMs = 60000;
  const cacheRefreshLockMs = 5000;
  const ifNotExists = "NX";
  const expire = "PX";

  var mappings = {
    "pihut": pihut,
    "pimoroni": pimoroni,
    "adafruit": adafruit
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
                  if(refreshErr) {
                    console.error(refreshErr);
                  }
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
