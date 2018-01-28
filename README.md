Sisal with Ident-Syntax [![Build Status](https://travis-ci.org/parsifal-47/sisal-is.svg?branch=master)](https://travis-ci.org/parsifal-47/sisal-is)
========

Ident-based dialect for sisal with statically derived types

### How does it look like

A set of examples is available [here](examples/).

The main difference between ordinary Sisal and this version that is does not require types to be explicitly specified and uses indents instead of *end function* stuff:

```python
  Conv = f(M, A, N, X)
    for I in [1..N-M+1]
    returns array of for J in [1..M]
        returns sum of A[J] * X[I+J-1]

  Main = f(M, Cycles)
    let
      A = for I in [1..M] returns array of I
      X = for I in [1.. M * Cycles] returns array of I
    in
      Conv( M, A, M * Cycles, X )
```

### Supported constraints

- f (function)
- let in
- for in [at] returns
- sum, min, max, array (reductions)
- arithmetics + - * /


### Standard library

- sin
- cos
- sqrt
- random
- double
- print


### Deployment

to setup:

```bash
npm install
```

or

```bash
make setup
```

to generate GraphML:

```bash
node tographml <inputfile.sis> <outputfile.xml>
```

to run tests:

```bash
make test
```

to rebuild lex:

```bash
make rebuild
```

### Feedback

Please, feel free to create issue or make contribution to this software!
