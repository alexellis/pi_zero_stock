### Raspberry PI Zero Stock Check

A high-speed, cached stock checker for the Raspberry PI Zero through screen-scraping.

* Install Node.js 4.x, Redis
* `npm install` in stock_fetch and web folders
* Start `redis-server`
* `npm start` in both folders.

#### Supported endpoints:

* pimoroni
* pihut
* pisupply

To add an endpoint look at the stock_fetch folder and add a new file under the *fetch* folder.

#### Accessing the API:

```
curl http://localhost:3000/stock/pimoroni/
curl http://localhost:3000/stock/pisupply/
curl http://localhost:3000/stock/pihut/
```

* 200 is given if cache is valid and the stock will be returned as true or false.
* 202 means the check was in progress, send the request again.
