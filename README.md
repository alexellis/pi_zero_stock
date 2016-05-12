### Raspberry PI Zero Stock Check

A high-speed, cached stock checker for the Raspberry PI Zero through screen-scraping.

#### Installation (easy way)

Using latest version of Docker and docker-compose:

```
$ git clone https://github.com/alexellis/pi_zero_stock
$ docker-compose up -d
```

#### Manual installation or development:

* Install Node.js 4.x, Redis
* `npm install` in stock_fetch and web folders
* Start `redis-server`
* `npm start` in both folders.

#### Supported endpoints:

I've implemented endpoints for the following UK stores:

* pimoroni
* pihut
* pisupply

To extend the code and add a new endpoint look at the `stock_fetch` project and add a new file under the `fetch` folder. This also needs to be updated in the entrypoint of `stock_fetch`.

#### Accessing the API:

```
curl http://localhost:3000/stock/pimoroni/
curl http://localhost:3000/stock/pisupply/
curl http://localhost:3000/stock/pihut/
```

* 200 is given if cache is valid and the stock will be returned as true or false.
* 202 means the check was in progress, send the request again.

#### Viewing in web-browser

Access the following:

http://localhost:3000/

#### Hosting the site

* See the Docker installation
* Use nginx to forward requests on port 80 to the local machine on port 3000

#### Todo:

[ ] Should have - Switch to pm2 for the node processes
[ ] Should have - coloured bootstrap wells or pills for in/out of stock.
[ ] Could have - web hooks (posting to Twitter)
[ ] Could have - show stock for other suppliers.

