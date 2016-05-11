"use strict"

// Can be used in a UNIX pipe
// Any shops with stock will be printed on stdout.

const Redis = require('redis');
const async = require('async');
const pull = Redis.createClient();

let allStockRefreshed = false;

let results =  {
  "pimoroni": {tries:0},
  "pisupply": {tries:0},
  "pihut": {tries:0}
};

let q = async.queue((task, next) => {
  pull.publish("stock", task.id);
//  console.log(task.id)
  pull.get(task.id + ".stock", (err, val) => {
    if(val) {
      var stock = (val==true||val == "1");
      results[task.id].result = stock;
      results[task.id].done = true;
    }
    results[task.id].tries = results[task.id].tries+1;
    next();
  });
}, 4);

Object.keys(results).forEach(function(store) {
  q.push({id: store});
});

q.drain = function() {
  var retry = [];
  Object.keys(results).forEach(function(result) {
    if(!results[result].done && results[result].tries <= 3) {
      retry.push({id: result });
    }
  });

  if(retry.length) {
    setTimeout(function() {
      retry.forEach(function(retryItem) {
        q.push(retryItem);
      })
    }, 2000);
  }
  else {
    Object.keys(results).forEach(function(resultKey) {
      if(results[resultKey].result) {
        console.log(resultKey);
      }
    })
    pull.quit();
  }
}
