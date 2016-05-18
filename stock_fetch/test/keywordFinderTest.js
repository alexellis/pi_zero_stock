"use strict"

const sinon = require('sinon');
const expect = require('chai').expect;

const KeywordFinder = require('../fetch/keywordFinder');

describe("keywordFinderTests", () => {
  var sandbox;
  var request;
  before(() => { 
    sandbox = sinon.sandbox.create();
    request = { get: sinon.stub() };
  });
  it("finds got an error on HTTP request", (done) => {
      request.get.yields("some error", {}, "");

      let finder = new KeywordFinder({request: request},  "http://webpage/");
      finder.refresh((err, stock) => {
        expect(err).to.exist;

        done();
      });   
  });
  it("finds the keyword", (done) => {
      request.get.yields(null, {}, "<div class=\"stock-level in-stock\">Item in stock</div>");
      let finder = new KeywordFinder({request: request},  "http://webpage/");
      finder.refresh((err, stock) => {
        expect(err).not.to.exist;
        expect(stock).to.exist;
        expect(stock.stock).to.equal(true);
        done();
      });   
  });
it("cannot find the keyword", (done) => {
      request.get.yields(null, {}, "<div class=\"stock-level no-stock\">Item not in stock</div>");
      let finder = new KeywordFinder({request: request},  "http://webpage/");
      finder.refresh((err, stock) => {
        expect(err).not.to.exist;
        expect(stock.stock).to.equal(false);
        done();
      });   
  })
});
