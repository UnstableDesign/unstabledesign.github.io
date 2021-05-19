# Matrix Math

This JavaScript module contains a Matrix class that will help you work with mathematical matrices.

## Table of Contents

* [Usage](#usage)
* [API](#api)
  * [Overview](#overview)
  * [Constructor](#constructor)
  * [Instance properties](#instance-properties)
  * [Static methods](#static-methods)
  * [Instance methods](#instance-methods)
* [Versioning](#versioning)
* [Unit tests](#unit-tests)
* [License](#license)

## Usage

The module is created in the CommonJS format, exporting using module.exports, meaning you need a CommonJS require system to use it. It is published in npm, so including it in node.js is simple:

Install it in the command line:

```
npm install matrixmath
```

Then include the module in your code:

```
var Matrix = require('matrixmath/Matrix');
```

## API

### Overview

**Constructor**

* new Matrix(opt_rows, opt_cols, opt_setInitial)

**Instance properties**

* rows
* cols
* length

**Static methods**

* add (matrix, matrix1[,…matrixN])
* subtract (matrix, matrix1[,…matrixN])
* multiply (matrix, matrix1[,…matrixN])
* divide (matrix, matrix1[,…matrixN])

**Instance methods**

* setIdentityData ()
* setEmptyData ()
* setData (data, opt_rows, opt_cols)
* getData ()
* toArray ()
* toLogString ()
* copy (matrix)
* clone ()
* add (matrix[,…matrixN])
* subtract (matrix[,…matrixN])
* multiply (matrix[,…matrixN])
* divide (matrix[,…matrixN])
* power (number)
* transpose ()
* invert ()
* getDeterminant ()
* equals (input)
* isIdentity ()




### Constructor

Create a new Matrix instance by using the constructor:

#### new Matrix()

```
var matrix = new Matrix();
```

#### new Matrix(opt_rows, opt_cols)

```
var matrix = new Matrix(3, 3);
```
```
> console.log(matrix.toLogString());
[
  1  0  0
  0  1  0
  0  0  1
]
```

#### new Matrix(opt_rows, opt_cols, opt_setInitial)

```
var matrix = new Matrix(3, 3, false);
```
```
> console.log(matrix.toLogString());
[
  undefined  undefined  undefined
  undefined  undefined  undefined
  undefined  undefined  undefined
]
```

---

### Instance properties

#### matrix.rows

The rows property contains the number of rows in the matrix.

```
> console.log(matrix.rows);
3
```

#### matrix.cols

The cols property contains the number of columns in the matrix.

```
> console.log(matrix.cols);
3
```

#### matrix.length

The length property contains the number of values in the matrix.

```
> console.log(matrix.length);
9
```

---

### Static methods

The following methods will return a new Matrix instance.


#### Matrix.add(matrix1, matrix2[,…matrixN])

Creates a new matrix with the sum of the passed in matrices. All matrices must have the same size. If a matrix is found that is not the same size, it is skipped.

```
var matrix = Matrix.add(matrix1, matrix2);
```


#### Matrix.subtract(matrix1, matrix2[,…matrixN])

Creates a new matrix with the difference of the passed in matrices. All matrices must have the same size. If a matrix is found that is not the same size, it is skipped.

```
var matrix = Matrix.subtract(matrix1, matrix2);
```


#### Matrix.multiply(matrix1, matrix2[,…matrixN])

Creates a new matrix with the product of the passed in matrices. All matrices must either be square and of the same size, or the next matrix in line must have the same number of rows as the number of columns in the previous result.

The first argument must be a matrix instance, but the rest can be either matrices or numbers. If a number is seen, a scalar multiplication is made.

```
var matrix = Matrix.multiply(matrix1, matrix2);
// or
var matrix = Matrix.multiply(matrix1, 3);
```


#### Matrix.divide(matrix1, matrix2[,…matrixN])

Creates a new matrix with the quotient of the passed in matrices. All matrices must be square and of the same size.

```
var matrix = Matrix.divide(matrix1, matrix2);
```

---

### Instance methods

The following methods are available on all Matrix instances.



#### matrix.setIdentityData()

Set the data in the matrix to the identity matrix.

```
var matrix = new Matrix(3, 3, false).setIdentityData();
```
```
> console.log(matrix.toLogString());
[
  1  0  0
  0  1  0
  0  0  1
]
```



#### matrix.setEmptyData()

Set the data in the matrix to be only zeros.

```
var matrix = new Matrix(3, 3, false).setEmptyData();
```
```
> console.log(matrix.toLogString());
[
  0  0  0
  0  0  0
  0  0  0
]
```



#### matrix.setData(data, opt_rows_ opt_cols)

Set the data in the matrix to the passed in data.

```
var matrix = new Matrix(3, 3);
matrix.setData([1, 2, 3, 4], 2, 2);
```
```
> console.log(matrix.toLogString());
[
  1  2
  3  4
]
```

```
var matrix = new Matrix(3, 3);
matrix.setData([1, 2, 3, 4, 5, 6, 7, 8, 9]);
```
```
> console.log(matrix.toLogString());
[
  1  2  3
  4  5  6
  7  8  9
]
```

```
var matrix = new Matrix(3, 3);
matrix.setData(1, 2, 3, 4, 5, 6, 7, 8, 9);
```
```
> console.log(matrix.toLogString());
[
  1  2  3
  4  5  6
  7  8  9
]
```



#### matrix.getData()

Get the data in the matrix as an array with extra data.

```
var matrix = new Matrix(2, 2);
```
```
> console.log(matrix.getData());
[1, 0, 0, 1]
> console.log(matrix.getData().rows);
2
> console.log(matrix.getData().cols);
2
```



#### matrix.toArray()

Get the data in the matrix as an array.

```
var matrix = new Matrix(2, 2);
```
```
> console.log(matrix.toArray());
[1, 0, 0, 1]
```



#### matrix.toLogString([opt_indentation[, opt_separator[, opt_start[, opt_end]]]])

Get the data for this matrix as a formatted string, which is useful for logging and debugging. It will be formatted with line breaks to visualize the rows and columns.

```
var matrix = new Matrix(3, 3);
```

```
> console.log(matrix.toLogString());
[
  1  0  0
  0  1  0
  0  0  1
]
```

```
> console.log(matrix.toLogString(5));
[
     1  0  0
     0  1  0
     0  0  1
]
```

```
> console.log(matrix.toLogString('  ', ' | '));
[
  1 | 0 | 0
  0 | 1 | 0
  0 | 0 | 1
]
```

```
> console.log(matrix.toLogString(0, ' | ', '-- start --', '-- end --'));
-- start --
1 | 0 | 0
0 | 1 | 0
0 | 0 | 1
-- end --
```

#### matrix.copy(matrix1)

Copies the data from another matrix into the original matrix.

```
var matrix = new Matrix(2, 2);
var matrix1 = new Matrix(2, 2, false).setData(1, 2, 3, 4);
matrix.copy(matrix1);
```
```
> console.log(matrix.toLogString());
[
  1  2
  3  4
]
```


#### matrix.clone()

Returns a new matrix with the same content as the first one.

```
var matrix = new Matrix(2, 2);
var matrix1 = matrix.clone();
```


#### matrix.add(matrix1[,…matrixN])

Adds all the matrices into the original matrix. All matrices must have the same size as the original one. If a matrix is found that is not the same size, it is skipped.

```
var matrix = new Matrix(1, 3).setData(1, 2, 3);
var matrix1 = new Matrix(1, 3).setData(2, 4, 6);
matrix.add(matrix1);
```
```
> console.log(matrix.toLogString());
[
  3  6  9
]
```


#### matrix.subtract(matrix1[,…matrixN])

Subtracts all the matrices from the original matrix. All matrices must have the same size as the original one. If a matrix is found that is not the same size, it is skipped.

```
var matrix = new Matrix(1, 3).setData(1, 2, 3);
var matrix1 = new Matrix(1, 3).setData(2, 4, 6);
matrix.subtract(matrix1);
```
```
> console.log(matrix.toLogString());
[
  -2  -2  -3
]
```


#### matrix.multiply(matrix1[,…matrixN])

Multiplies all the matrices into the original matrix. All matrices must either be square and of the same size, or the next matrix in line must have the same number of rows as the number of columns in the previous result.

The arguments can be either matrices or numbers. If a number is seen, a scalar multiplication is made.

```
var matrix = new Matrix(2, 2).setData(1, 2, 3, 4);
var matrix1 = new Matrix(2, 2).setData(2, 4, 6, 8);
matrix.multiply(matrix1);
```
```
> console.log(matrix.toLogString());
[
  14  20
  30  44
]
```

```
var matrix = new Matrix(2, 2).setData(1, 2, 3, 4);
matrix.multiply(3);
```
```
> console.log(matrix.toLogString());
[
  3  6
  9  12
]
```


#### matrix.divide(matrix1[,…matrixN])

Divides all the matrices from the original matrix. All matrices must be square and of the same size as the original matrix.

```
var matrix = new Matrix(2, 2).setData(1, 0, 0, 1);
var matrix1 = new Matrix(2, 2).setData(2, 0, 0, 2);
matrix.divide(matrix1);
```
```
> console.log(matrix.toLogString());
[
  0.5  0
  0  -0.5
]
```

#### matrix.power(number)

Raises the matrix to the the given power.

```
var matrix = new Matrix(2, 2).setData(1, 2, 4, 1);
matrix.power(3);
```
```
> console.log(matrix.toLogString());
[
  25  22
  44  25
]
```

#### matrix.transpose()

Transposes the matrix.

```
var matrix = new Matrix(2, 2).setData(1, 2, 4, 1);
matrix.transpose();
```
```
> console.log(matrix.toLogString());
[
  1  4
  2  1
]
```

#### matrix.invert()

Inverts the matrix.

```
var matrix = new Matrix(3, 3).setData(
  3, 0, 2,
  2, 0, -2,
  0, 1, 1
);
matrix.invert();
```
```
> console.log(matrix.toLogString());
[
  0.2  0.2  0
  -0.2  0.3  1
  0.2  -0.3  0
]
```

#### matrix.getDeterminant()

Gets the determinant of the matrix. The matrix must be square for this to be possible. If it's not square, this will return `null`.

```
var matrix = new Matrix(2, 2).setData(4, 6, 3, 8);
var determinant = matrix.getDeterminant();
```
```
> console.log(determinant);
14
```

#### matrix.equals(matrix1)

Tests if the matrix has the same content as another matrix. Returns `true` if it has, `false` otherwise.

```
var matrix = new Matrix(3, 2).setData(3, 0, 2, 0, 0, 1);
var matrix1 = new Matrix(3, 2).setData(3, 0, 2, 0, 0, 1);
var matrix2 = new Matrix(2, 2).setData(3, 0, 2, 0);

matrix.equals(matrix1); // true
matrix.equals(matrix2); // false
```

#### matrix.isIdentity()

Tests if the data of the matrix represents the identity matrix. Returns `true` if it is, `false` otherwise.

```
var matrix = new Matrix(3, 3);
var matrix1 = new Matrix(3, 3, false).setData(1, 0, 0, 0, 1, 0, 0, 0, 1);
var matrix2 = new Matrix(3, 3, false).setData(1, 2, 3, 4, 5, 6, 7, 8, 9);

matrix.isIdentity(); // true
matrix1.isIdentity(); // true
matrix2.isIdentity(); // false
```


## Versioning

This module is versioned according to [Semantic Versioning](http://semver.org/) (uses the format major.minor.patch). If there is a breaking change, the major part of the version number will be updated.


## Unit tests

The Matrix class is fully unit tested. It uses mocha and expect.js. Just run the tests from the command line:

```
npm run test
```


## License

The project is licensed under the MIT license.

Copyright (c) 2014 Johannes Koggdal

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE.
