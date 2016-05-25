"use strict"

const sinon = require('sinon');
const expect = require('chai').expect;
const cheerio = require('cheerio');
const Adafruit = require('../fetch/adafruit');

describe("adafruitTests", () => {
  var sandbox;
  var request;
  before(() => {
    sandbox = sinon.sandbox.create();
    request = { get: sinon.stub() };
  });

  it("finds product stock", (done) => {

      let html = require('fs').readFileSync("./test/adafruit_stock.html", "utf8");

      request.get.yields(null, {}, html);
      let finder = new Adafruit({request: request,cheerio: cheerio}, ["2816", "2817", "2885"],  "http://webpage/");

      finder.refresh((err, stock) => {
        expect(err).not.to.exist;
        expect(stock).to.exist;
        expect(stock.stock).to.equal(true);
        expect(stock.totalAmount).not.to.exist;
        done();
      });
  });

  it("cannot find product stock", (done) => {

      let html = require('fs').readFileSync("./test/adafruit_nostock.html", "utf8");

      request.get.yields(null, {}, html);
      let finder = new Adafruit({request: request,cheerio: cheerio}, ["2816", "2817", "2885"],  "http://webpage/");

      finder.refresh((err, stock) => {
        expect(err).not.to.exist;
        expect(stock).to.exist;
        expect(stock.stock).to.equal(false);
        expect(stock.totalAmount).not.to.exist;
        done();
      });
  });
});
