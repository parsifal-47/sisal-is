Sisal with Ident-Syntax [![Build Status](https://travis-ci.org/parsifal-47/sisal-is.svg?branch=master)](https://travis-ci.org/parsifal-47/sisal-is)
========

Modernized dialect of Sisal with type inference!

### How does it look like

The main difference between ordinary Sisal and this version that is does not require types to be explicitly specified and uses indents instead of *end function* stuff:

```python
  conv = f(m, a, n, x)
    for i in [1..n-m+1]
    returns array of for j in [1..m]
        returns sum of a[j] * x[i+j-1]

  main = f(m, cycles)
    let
      a = for i in [1.. m] returns array of i
      x = for i in [1.. m * cycles] returns array of i
    in
      conv( m, a, m * cycles, x )
```

Please read [language overview](overview.md) if you want to know more.

A set of examples is available [here](examples/).

### Supported constraints

- f (function)
- let in
- if elseif else
- for in [at] returns
- for while
- for repeat
- sum, product, array, stream, value, max, min (reductions)
- arithmetics + - * /


### Standard library

- sin
- cos
- sqrt
- pow


### Deployment

to setup:

```bash
npm install
```

or

```bash
make setup
```

to run tests:

```bash
make test
```

to compile:

```bash
make compile
```

to run sisal program:

```bash
node ./build/sisal.js <program.sis>
```

### Feedback

Please, feel free to create issue or make contribution to this software!
