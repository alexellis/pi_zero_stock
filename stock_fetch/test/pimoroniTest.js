"use strict"

const sinon = require('sinon');
const expect = require('chai').expect;

const Pimoroni = require('../fetch/pimoroni');

describe("pimoroni scraper tests", () => {
  var sandbox;
  var request;

  before(() => {
    sandbox = sinon.sandbox.create();
    request = { get: sinon.stub() };
  });
  afterEach(() => {
    sandbox.reset();
  });

  it("gets a HTTP error, gives no stock", (done) => {

      request.get.yields("error", {}, null);
      let finder = new Pimoroni({request: request});

      finder.refresh((err, stock) => {
        expect(stock).to.exist;
        expect(stock.stock).to.equal(false);
        done();
      });
  });

  it("finds product quantity", (done) => {

      let products1 = {"product": {"variants":[{"inventory_quantity": 1, price:1} ]}};
      let products2 = {"product": {"variants":[{"inventory_quantity": 1, price:1} ]}};
      let products3 = {"product": {"variants":[{"inventory_quantity": 1, price:1} ]}};

      request.get.withArgs({url:"https://shop.pimoroni.com/products/raspberry-pi-zero.json", "User-Agent": "pi-check", "json": true})
      .yields(null, {}, products1);
      request.get.withArgs({url:"https://shop.pimoroni.com/products/pi-zero-complete-starter-kit.json", "User-Agent": "pi-check", "json": true})
      .yields(null, {}, products2);
      request.get.withArgs({url:"https://shop.pimoroni.com/products/pi-zero-project-kits.json", "User-Agent": "pi-check", "json": true})
      .yields(null, {}, products3);

      let finder = new Pimoroni({request: request});

      finder.refresh((err, stock) => {
        expect(err).not.to.exist;
        expect(stock).to.exist;
        expect(stock.stock).to.equal(true);
        expect(stock.totalAmount).to.equal(3);
        done();
      });
  });



});
