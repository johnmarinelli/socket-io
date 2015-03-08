var Lab = require('lab'),
    lab = exports.lab = Lab.script(),
    Code = require('code'),
    suite = lab.suite,
    test = lab.test,
    before = lab.before,
    after = lab.after,
    expect = Code.expect,
    Cell = require('../Cell.js').Cell,
    HashTable = require('../HashTable.js').HashTable;

suite('hashtable', function() {
  test('add a cell with coordinate (1,2) into hashtable', function(done) {
    var ht = new HashTable(function(x,y) {
      return (x ^ (y << 1)) >> 1;
    });
    ht.insert(new Cell(1,2, false));
    expect(ht.find(1,2).mAlive).to.equal(false);
    done();
  });
  
  test('add multiple cells into hashtable and update one', function(done) {
    var ht = new HashTable(function(x,y) {
      return (x ^ (y << 1)) >> 1;
    });

    ht.insert(new Cell(1,2, false));
    ht.insert(new Cell(3,4, true));
    ht.insert(new Cell(5,6, false));
    ht.insert(new Cell(1,2, true));

    expect(ht.find(1,2).mAlive).to.equal(true);
    done();
  });
});
