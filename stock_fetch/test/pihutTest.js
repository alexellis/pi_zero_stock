"use strict"

const sinon = require('sinon');
const expect = require('chai').expect;

const Pihut = require('../fetch/pihut');

describe("pihutTests", () => {
  var sandbox;
  var request;
  before(() => { 
    sandbox = sinon.sandbox.create();
    request = { get: sinon.stub() };
  });

  it("finds product quantity", (done) => {

      let html = "product: {\"variants\": [{\"inventory_quantity\": 1 }]  },";
    
      request.get.yields(null, {}, html);
      let finder = new Pihut({request: request},  "http://webpage/");

      finder.refresh((err, stock) => {
        expect(err).not.to.exist;
        expect(stock).to.exist;
        expect(stock.stock).to.equal(true);
        expect(stock.totalAmount).to.equal(1);
        done();
      });   
  });

  it("cannot find any stock", (done) => {
    
      let html = "product: {  },";
    
      request.get.yields(null, {}, html);
      let finder = new Pihut({request: request},  "http://webpage/");

      finder.refresh((err, stock) => {
        expect(err).not.to.exist;
        expect(stock).to.exist;
        expect(stock.stock).to.equal(false);
        done();
      });   
  });
});