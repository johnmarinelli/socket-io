var Lab = require('lab'),
    lab = exports.lab = Lab.script(),
    Code = require('code'),
    suite = lab.suite,
    test = lab.test,
    before = lab.before,
    after = lab.after,
    expect = Code.expect,
    Graph = require('./../lib/Graph.js').Graph;

suite('graph', function() {
  test('returns true when making a 0x0 graph', function(done) {
    var g = new Graph(0, 0, 0, 0);

    expect(g.shape()[0]).to.equal(0);
    expect(g.shape()[1]).to.equal(0);
    expect(g.shape()[2]).to.equal(0);
    done();
  });

  test('returns true when making a 50x50 graph', function(done) {
    var g = new Graph(50, 50, 50, 50);
    expect(g.shape()[0]).to.equal(50);
    expect(g.shape()[1]).to.equal(50);
    expect(g.shape()[2]).to.equal(2500);
    done();
  });

  test('returns true when making a graph with negative values', function(done) {
    var g = new Graph(-10, -2, -10, -2);
    expect(g.shape()[0]).to.equal(10);
    expect(g.shape()[1]).to.equal(2);
    expect(g.shape()[2]).to.equal(20);
    done();
  });
});
