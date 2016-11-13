Sisal with Ident-Syntax
========

Ident-based dialect for sisal with statically derived types

### How does it look like

A set of examples is available [here](examples/).

The main difference between ordinary Sisal and this version that is does not require types to be explicitly specified and uses indents instead of *end function* stuff:

	Conv = f(M, A, N, X)
	    for I in [1..N-M+1]
	    returns array of 
			for J in [1..M]
			returns sum of A[J] * X[I+J-1]

	Main = f(M, Cycles)
	    let
			A = for I in [1..M] returns array of double(I)
			X = for I in [1..M] * Cycles returns array of double(I)
	    in
			Conv( M, A, M * Cycles, X )


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

	npm install

or

	make setup


to run tests:

	make test


to rebuild lex:

	make rebuild


### Feedback

Please, feel free to create issue or make contribution to this software!