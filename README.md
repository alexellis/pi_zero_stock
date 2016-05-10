Raspberry PI Zero Stock Check

* Install and start redis
* `npm install` in stock_fetch and web folders
* `npm start` in both folders.


Accessing the API:

```
curl http://localhost:3000/stock/pimoroni/
```

* 200 is given if cache is valid and the stock will be returned as true or false.
* 202 means the check was in progress, retry the request.
