/**
 * @module matrixmath/arrays
 * @private
 */
'use strict';

/**
 * Pool of arrays.
 * Organized by array length to avoid changing lengths of arrays.
 * Each array gets a non-enumerable property `inUse` which is `true` when the
 * array is in use.
 *
 * @type {Object.<number, Array.<Array>>}
 */
var pool = {};

/**
 * Get an array from the pool.
 * This array will have a length of 0.
 *
 * @return {Array} An array.
 */
function get() {
  return getWithLength(0);
}

/**
 * Get an array with the specified length from the pool.
 *
 * @param {number} length The preferred length of the array.
 *
 * @return {Array} An array.
 */
function getWithLength(length) {
  var arrays = pool[length];
  var array;
  var i;

  // Create the first array for the specified length
  if (!arrays) {
    array = create(length);
  }

  // Find an unused array among the created arrays for the specified length
  if (!array) {
    for (i = arrays.length; i--;) {
      if (!arrays[i].inUse) {
        array = arrays[i];
        break;
      }
    }

    // If no array was found, create a new one
    if (!array) {
      array = create(length);
    }
  }

  array.inUse = true;
  return array;
}

/**
 * Give back an array to the pool.
 * This will reset the array to the original length and make all values
 * undefined.
 *
 * @param {Array} array An array that was gotten from this pool before.
 */
function giveBack(array) {

  // Don't return arrays that didn't originate from this pool
  if (!array.hasOwnProperty('originalLength')) return;

  // Reset all the elements
  for (var i = array.length; i--;) {
    array[i] = undefined;
  }

  // Reset the length
  array.length = array.originalLength;

  // Remove custom properties that the Matrix class might have added
  delete array.rows;
  delete array.cols;

  // Let the pool know that it's no longer in use
  array.inUse = false;
}

/**
 * Create a new array and add it to the pool for the specified length.
 *
 * @param {number} length The length of the array to create.
 *
 * @return {Array} The new array.
 */
function create(length) {
  var array = new Array(length);

  // Create a non-enumerable property as a flag to know if the array is in use
  Object.defineProperties(array, {
    inUse: {
      enumerable: false,
      writable: true,
      value: false
    },
    originalLength: {
      enumerable: false,
      value: length
    }
  });

  if (!pool[length]) pool[length] = [];
  pool[length].push(array);

  return array;
}

exports.get = get;
exports.getWithLength = getWithLength;
exports.giveBack = giveBack;
