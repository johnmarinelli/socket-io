var Lab = require('lab'),
    lab = exports.lab = Lab.script(),
    Code = require('code'),
    suite = lab.suite,
    test = lab.test,
    before = lab.before,
    after = lab.after,
    expect = Code.expect,
    Cell = require('../lib/Cell.js').Cell,
    HashTable = require('../lib/HashTable.js').HashTable;

suite('hashtable', function() {
  test('add a cell with coordinate (1,2) into hashtable', function(done) {
    var ht = new HashTable(function(x,y) {
      return (x ^ (y << 1)) >> 1;
    });
    var c1 = new Cell(1,2, false);
    ht.insert(c1);
    expect(ht.get(c1).mAlive).to.equal(false);
    done();
  });
  
  test('add multiple cells into hashtable and update one', function(done) {
    var ht = new HashTable(function(x,y) {
      return (x ^ (y << 1)) >> 1;
    });

    var c1 = new Cell(1,2, true);
    var c2 = new Cell(3,4, true);
    var c3 = new Cell(5,6, false);

    ht.insert(c1);
    ht.insert(c2);
    ht.insert(c3);
    
    expect(ht.get(c1).mAlive).to.equal(true);
    done();
  });

  test('remove cell from hashtable', function(done) {
    var ht = new HashTable(function(x,y) {
      return (x ^ (y << 1)) >> 1;
    });

    var c1 = new Cell(1,2, true);
    var c2 = new Cell(3,4, true);
    var c3 = new Cell(5,6, false);

    ht.insert(c1);
    ht.insert(c2);
    ht.insert(c3);
    
    expect(ht.remove(c1)).to.equal(true);
    done();
  });
  
  test('update cell from hashtable', function(done) {
    var ht = new HashTable(function(x,y) {
      return (x ^ (y << 1)) >> 1;
    });

    var c1 = new Cell(1,2, true);
    var c2 = new Cell(3,4, true);
    var c3 = new Cell(5,6, false);

    ht.insert(c1);
    ht.insert(c2);
    ht.insert(c3);

    ht.update(c2, { alive: false });

    expect(ht.get(c2).mAlive).to.equal(false);
    done();
  });
});
