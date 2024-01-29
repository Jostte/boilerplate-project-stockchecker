const chaiHttp = require("chai-http");
const chai = require("chai");
const assert = chai.assert;
const server = require("../server");

chai.use(chaiHttp);

suite("Functional Tests", function () {
  suite("GET /api/stock-prices => stockData object", function () {
    test("1 stock", function (done) {
      chai
        .request(server)
        .get("api/stock-prices")
        .query("stock=goog")
        .end(function (err, res) {
          assert.equal(res.status, 200);
        });
      done();
    });
    test("1 stock with like", function (done) {
      chai
        .request(server)
        .get("api/stock-prices")
        .query("stock=goog&like=true")
        .end(function (err, res) {
          assert.equal(res.status, 200);
        });
      done();
    });
    test("1 stock with like again", function (done) {
      chai
        .request(server)
        .get("api/stock-prices")
        .query("stock=goog&like=true")
        .end(function (err, res) {
          assert.equal(res.status, 200);
        });
      done();
    });
    test("2 stocks", function (done) {
      chai
        .request(server)
        .get("api/stock-prices")
        .query("stock=goog&stock=msft")
        .end(function (err, res) {
          assert.equal(res.status, 200);
        });
      done();
    });
    test("2 stocks with like", function (done) {
      chai
        .request(server)
        .get("api/stock-prices")
        .query("stock=goog&stock=msft&like=true")
        .end(function (err, res) {
          assert.equal(res.status, 200);
        });
      done();
    });
  });
});
