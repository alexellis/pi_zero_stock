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
  
  it("has badly formed HTML -> no rows", (done) => {
      var fakecheerio = {
        load : sinon.stub()
      };
      var fakeDoc = (docKey) => {
        if(docKey== ".product-listing a") {
          return null;
        }
      };

      fakecheerio.load.returns(fakeDoc);
      request.get.yields(null, {}, "<html></html>");
      let finder = new Adafruit({request: request,cheerio: fakecheerio}, ["2816", "2817", "2885"],  "http://webpage/");

      finder.refresh((err, stock) => {
        expect(err).not.to.exist;
        expect(stock).to.exist;
        expect(stock.stock).to.equal(false);
        expect(stock.totalAmount).not.to.exist;
        done();
      });
  });
  

  it("fails to parse HTML", (done) => {

      var fakecheerio = {
        load : sinon.stub()
      };
      var eachStub = sinon.stub();
      eachStub.yields(0, null);
      
      fakecheerio.load.throws("cannot parse this document");
      request.get.yields(null, {}, "<html></html>");
      let finder = new Adafruit({request: request,cheerio: fakecheerio}, ["2816", "2817", "2885"],  "http://webpage/");

      finder.refresh((err, stock) => {
        expect(err).not.to.exist;
        expect(stock).to.exist;
        expect(stock.stock).to.equal(false);
        expect(stock.totalAmount).not.to.exist;
        done();
      });
  });

  it("has badly formed HTML -> has no attribs in row", (done) => {
      var fakecheerio = {
        load : sinon.stub()
      };
      var eachStub = sinon.stub();
      eachStub.yields(0, null);
      
      var fakeDoc = (docKey) => {
        if(docKey== ".product-listing a") {
          return {
            each : eachStub
          };
        }
      };

      fakecheerio.load.returns(fakeDoc);
      request.get.yields(null, {}, "<html></html>");
      let finder = new Adafruit({request: request,cheerio: fakecheerio}, ["2816", "2817", "2885"],  "http://webpage/");

      finder.refresh((err, stock) => {
        expect(err).not.to.exist;
        expect(stock).to.exist;
        expect(stock.stock).to.equal(false);
        expect(stock.totalAmount).not.to.exist;
        done();
      });
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
