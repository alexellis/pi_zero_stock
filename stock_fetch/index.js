"use strict"

const Redis = require('redis');
const request = require('request');

const Pihut = require("./fetch/pihut");
const Pimoroni = require("./fetch/pimoroni");

function main() {
  const subscribe = Redis.createClient();
  const push = Redis.createClient();
  const pihut = new Pihut();
  const pimoroni = new Pimoroni("https://shop.pimoroni.com/collections/raspberry-pi");

  subscribe.on("message", (channel, message) => {
    if(channel == "stock") {
      if(message == "pihut") {
        push.get(message+".stock", (getStockErr, stockVal)=> {
          if(!stockVal) {
            pihut.refresh((refreshErr, val)=> {
              console.log("Pihut refreshed");

              push.set(message+".stock", (val? 1 : 0), (err) => {
                push.expire(message+".stock", 5, (err) => {
                  console.log("Stock expiring in 5 secs.");
                });
              });

            });
          }
        });
      }
      else if(message == "pimoroni") {
        push.get(message+".stock", (getStockErr, stockVal)=> {
          if(!stockVal) {
            pimoroni.refresh((refreshErr, val)=> {
              console.log("pimoroni refreshed");

              push.set(message+".stock", (val?1:0), (err) => {
                push.expire(message+".stock", 5, (err) => {
                  console.log("Stock expiring in 5 secs.");
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
