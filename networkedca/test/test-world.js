var Lab = require('lab'),
    lab = exports.lab = Lab.script(),
    Code = require('code'),
    suite = lab.suite,
    test = lab.test,
    before = lab.before,
    after = lab.after,
    expect = Code.expect,
    Graph = require('../lib/Graph.js').Graph;
    World = require('../lib/World.js').World;

suite('world', function() {
  test('initialize a 10x10 world', function(done) {
    var g = new Graph(10, 10, 100, 100);
    var w = new World(g);
    expect(w.mCells.length).to.equal(10);
    done();
  });

  test('add a live cell at 0, 0', function(done) {
    var w = new World(new Graph(10, 10, 100, 100));
    w.addCell(0, 0, true);
    expect(w.getCell(0,0).mAlive).to.equal(true);
    done();
  });

  test('add a dead cell at 5, 5', function(done) {
    var w = new World(new Graph(10, 10, 100, 100));
    w.addCell(5, 5);
    expect(w.getCell(5,5).mAlive).to.equal(false);
    done();
  });
  
  test('add a live cell at 1, 5', function(done) {
    var w = new World(new Graph(10, 11, 100, 100));
    w.addCell(1, 5, true);
    expect(w.getCell(1,5).mAlive).to.equal(true);
    done();
  });
  
  test('add two live cells and kill one', function(done) {
    var w = new World(new Graph(10, 11, 100, 100));
    w.addCell(1, 5, true);
    w.addCell(5, 10, true);
    w.killCell(1, 5);
    expect(w.getCell(1,5).mAlive).to.equal(false);
    done();
  });
  
  test('add two live cells and check if living hashtable is size 2', function(done) {
    var w = new World(new Graph(10, 11, 100, 100));
    w.addCell(1, 5, true);
    w.addCell(5, 10, true);
    expect(w.mLiving.mSize).to.equal(2);
    done();
  });
  
  test('add two dead cells and check if dead hashtable is size 2', function(done) {
    var w = new World(new Graph(10, 11, 100, 100));
    w.addCell(1, 5, false);
    w.addCell(5, 10, false);
    expect(w.mDead.mSize).to.equal(2);
    done();
  });
  
  test('create 3 live cells, kill 1, check if dead hashtable is size 1', function(done) {
    var w = new World(new Graph(10, 11, 100, 100));
    w.addCell(1, 5, true);
    w.addCell(5, 10, true);
    w.addCell(2, 4, true);
    w.killCell(2, 4);
    expect(w.mDead.mSize).to.equal(1);
    done();
  });
});
