"use strict"

const request = require('request');
const express = require('express');
const app = express();
const Redis = require('redis');

app.get("/stock/:store/", (req, res) => {
  const store = req.params.store;
  if(store != "pimoroni" && store != "pihut" && store !="pisupply") {
    res.status(400);
    res.end();
  }

  pull.publish("stock", store);
  pull.get(store + ".stock", (err, val) => {
    if(!val) {
      res.status(202);
    } else {
      var stock = (val==true||val == "1");
      res.json({"stock": stock});
    }
    res.end();
  });
});

const pull = Redis.createClient();

const port = process.env.PORT || 3000;
app.listen(port, function() {
  console.log("Listening on port "+port);
});
