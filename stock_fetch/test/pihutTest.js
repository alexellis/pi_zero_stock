"use strict"

const sinon = require('sinon');
const expect = require('chai').expect;

const Pihut = require('../fetch/pihut');

describe("pihut scraper tests", () => {
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
      let finder = new Pihut({request: request});

      finder.refresh((err, stock) => {
        expect(stock).to.exist;
        expect(stock.stock).to.equal(false);
        done();
      });
  });

  it("finds product quantity", (done) => {

      let products1 = {"variants":[{"id": 14062715972 ,"inventory_quantity": 301,price:30} ]};
      let options = {
        url: "https://thepihut.com/products/raspberry-pi-zero.js",
        headers: {          
          "User-Agent": "stockalert.alexellis.io",
        },
        "json": true
      };
 
      request.get.withArgs(options).yields(null, {}, products1);

      let finder = new Pihut({request: request});

      finder.refresh((err, stock) => {
        expect(err).not.to.exist;
        expect(stock).to.exist;
        expect(stock.stock).to.equal(true);

        // expect(stock.totalAmount).to.exist;
        expect(stock.totalAmount).to.equal(301);
        done();
      });
  });

});
