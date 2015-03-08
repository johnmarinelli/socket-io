function HashTable(hasher) {
  this.mHasher = hasher;
  this.mBuckets = [];
};

HashTable.prototype.insert = function(cell) {
  var index = this.mHasher(cell.mX, cell.mY);

  // check to see if this bucket exists.  if not, create a new bucket.
  if (undefined === this.mBuckets[index]) this.mBuckets[index] = [];
  
  // create a temporary object to reduce amount of this.mBuckets[index] references
  var bucket = this.mBuckets[index],
      len = bucket.length,
      j = 0,
      overwrite = false;

  // iterate through items in bucket
  for ( ; j < len; ++j) {
    var other = bucket[j];
    if (other.mX === cell.mX &&
        other.mY === cell.mY) {
      // if there's already an equivalent cell in this bucket, update it
      this.mBuckets[index][j] = cell;
      overwrite = true;
      break;
    }
  }

  // if there wasn't an equivalent cell in the bucket, append cell
  if (!overwrite) this.mBuckets[index].push(cell);
};

HashTable.prototype.find = function(x, y) {
  var index = this.mHasher(x, y),
      bucket = this.mBuckets[index];
  
  // if there's no bucket, return false
  if (undefined === bucket) return false;

  var len = bucket.length,
      j = 0;

  for ( ; j < len; ++j) {
    var other = bucket[j];
    if (other.mX === x &&
        other.mY === y) {
      return bucket[j];
    }
  }

  return false;
};

exports.HashTable = HashTable;
