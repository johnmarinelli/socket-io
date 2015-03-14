// Specialized HashTable for any objects that are to be indexed by coordinates.
// Key: x, y
function HashTable(hasher) {
  this.mHasher = hasher;
  this.mBuckets = [];
  this.mSize = 0;
  this.mIndices = [];
}

HashTable.prototype.insert = function(cell) {
  var index = this.mHasher(cell.mX, cell.mY);

  // check to see if this bucket exists.  if not, create a new bucket.
  if (undefined === this.mBuckets[index]) {
    this.mBuckets[index] = [];
    this.mIndices.push(index);
  }
  
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
  if (!overwrite) { 
    this.mBuckets[index].push(cell);
    ++this.mSize;
  }
};

// simple find and return.
HashTable.prototype.get = function(x, y) {
  var hashTable = this;

  return this.find(x, y, function(data, err) {
    if (err) {
      console.log(err);
      return false;
    }
    return data.element;
  });
};

// returns true if element exists in hash.
HashTable.prototype.hasElement = function(x, y) {
  var hashTable = this;

  return this.find(x, y, function(data, err) {
    if (!data) {
      return false;
    }
    return true;
  });
};

// find and remove.
HashTable.prototype.remove = function(x, y) {
  var hashTable = this;
  
  return this.find(x, y, function(data, err) {
    // callback.  removes the found element.
    if (err) {
      console.log(err);
      return false;
    }
    
    var bucketNum = data.bucketNum,
        bucketIndex = data.bucketIndex;

    hashTable.mBuckets[bucketNum].splice(bucketIndex, 1);
    --hashTable.mSize;

    // the find() function returns whatever this cb returns.
    return true;
  });
};

// find and update.
HashTable.prototype.update = function(x, y, newData) {
  var hashTable = this;

  return this.find(x, y, function(data, err) {
    if (err) {
      console.log(err);
      return false;
    }
    
    data.element.update(newData);
    return data.element;
  });
};

// 1: call find()
// 2: find() returns cb
// 3: cb returns true/false
// 4: find() returns true/false
HashTable.prototype.find = function(x, y, cb) {
  var index = this.mHasher(x, y),
      bucket = this.mBuckets[index];
  
  // if there's no bucket, return false
  if (undefined === bucket) return cb(false, 'Bucket doesn\'t exist at index: ' + index);

  var len = bucket.length,
      j = 0;

  for ( ; j < len; ++j) {
    var other = bucket[j];
    if (other.mX === x &&
        other.mY === y) {
      // return the element along with relevant data
      return cb({
        element: other,
        bucketNum: index,
        bucketIndex: j
      });
    }
  }

  // there's a bucket, but no item
  return cb(false, 'No element found at index: ' + index + '.  X: ' + x + ' Y: ' + y);
};

HashTable.prototype.clear = function() {
  this.mBuckets = [];
  this.mSize = 0;
  this.mIndices = [];
};

HashTable.prototype.forEach = function(cb) {
  var indicesCount = this.mIndices.length,
      i = 0;

  // iterate through each bucket index
  for ( ; i < indicesCount; ++i) {
    var index = this.mIndices[i],
        elemCount = this.mBuckets[index].length,
        j = 0;
    // in each bucket, perform callback on element
    for ( ; j < elemCount; ++j) {
      cb(this.mBuckets[index][j]);
    }
  }
};

exports.HashTable = HashTable;
