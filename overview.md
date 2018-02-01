# Sisal-IS

Strongly-typed programming language with type inference. There are no side effects and no input in a form that most of us familiar with. Evaluation is lazy.

Comparing to older Sisal versions it has lambdas and indent-based syntax. Check [this](comparison.md) document if you want to see new vs old.

## Code blocks

The main way to express nesting is indentation, but indentation is ignored inside brackets:

```python
1 + ( 2 +
    3 + 4)
```

This code will be interpreted equally to `1 + (2 + 3 + 4)`. Curly brackets could be used to write complex constraints inside brackets. In this case opening curly bracket
will be interpreted as new indentation level start and closing bracket -- indentation end.

It means that the following function definition:

```python
f()
  2
```

Could be equally rewritten as:

```python
f() {2}
```

## Primitive data types

Three primitive types are currently supported: signed integers, booleans and floats.
Capacity of integer and float is at least 32 bits. Notation is traditional,
hex numbers could be written as "0x...".

## Arithmetics

`*`, `/`, `+` and `-` are supported for float and integer numbers.

## Function definition

`f()` is defining a function. Inside of parenthesis a list of arguments is followed by
`returns` keyword and a list of return types.

```python
f(returns integer)
   2
```

This function takes no arguments and returns integer. Type definitions could be omitted:

```python
f()
   2
```

The following function takes two arguments and returns their sum.

```python
f(a, b)
   a + b
```

Derived types for arguments and return value depend on surrounding code. They could be fixed in a following way:

```python
f(a: integer, b: integer returns integer)
   a + b
```

## Sisal program

Program is a sequence of definitions, it is equal to first inner block of `let` operator
with one exception: definition `main` is invoked as a function.

```python
main = f()
   2 + 3
```

```python
dub = f(a)
   a * 2
main = f()
   2 + dub(3)
```

## Function application
In case of single argument, function can be applied with `of` syntax.

```python
dub = f(a)
   a * 2
main = f()
   2 + dub of 3
```

It makes possible to write nested loops without brackets as we'll see below.

## Closures and recursion

Function implicitly accessing its definition context.

```python
fib = f(M)
  if (M < 2)
    M
  else
    fib(M - 1) + fib(M - 2)
```

## Polymorphism

Supported for input arguments as well as for return values.

## Composite data types

### array

Contains elements of one type. Type itself is defined as `array[<element_type>]`.
Array value is defined as a list of its elements: `[2, 3, 4]`. Index is zero-based.

### record

Contains named fields. Datatype is defined as `record[name1: type1, name2: type2]`. Type annotations for fields are not required when could be inferred. Record value is defined as `[name1 = 2, name2 = 3]`. Default values are not supported.

### stream

This type is almost equal to `array`, except it could be infinite. Datatype is defined as `stream[<element_type>]`. Value of this type could be defined as stream([2, 3, 4]). Where function `stream` converts `array` into `stream`.

### function

Function datatype is defined as `function[<argument1_type>, ... [returns <return1_type>, ...]]`. Function value is defined with the following syntax:

```python
f()
   2
```

### datatype
Types could be set and assigned in the same way with other values:

```python
a = function[integer returns integer]
```

## Bindings (let)

Usually bindings serve better readability, the following statement is supported:

```python
main = f(m)
  let
    a = 1
    b = 2
  in
    a + b + m
```

`let` keyword is followed by definition list and `in` keyword, after which goes the expression for evaluation.

## If

```python
foo = f(a, b)
   if ( a > b )
      a - b
   else
      b - a
```

```python
foo = f(a, b)
   if ( a > b )
      a - b
   elseif ( a < b )
      b - a
   else
      0
```

## Loops
The most distinctive part of Sisal is loop definition. Body of each loop contains list of bindings which is equal to `let` operator, loop ends with reduction, it describes how values from loop iterations are aggregated.

Loops could contain initialization block and references to previous iterations with `old` keyword.

### Reductions

Built-in reductions are `sum`, `product`, `array`, `stream`, `value`, `max`, `min`.
Any user function which takes single stream argument could be used as a reduction. Recursive reductions are allowed.

### Range loops

All iterations are evaluated for a given array or stream.

```python
length = f()
   for i in [1 .. 100]
   returns array(i)
```

```python
length = f()
   for i in [1 .. 100]
   returns array(i), max(i), min(i)
```

```python
length = f(A: stream)
   for i in A
   returns array of i
```

Multi-dimensional ranges are supported:

```python
main = f(A)
  for i,j in [1 .. 100],[1 .. 100]
     s = A[i, j]
  returns stream of s
```

### Pre-conditional loops
Condition is evaluated before the first iteration.

```python
foo = f(N)
   for initial
      i = 0
   while (i<=N)
      i = old i + 1
   returns value of i
```

```python
foo = f(N, T, S)
   for initial
      t = T
      s = S
      i = 0
   while (i <= 2*N)
      i = old i + (t * s) + 2*S
   returns value of i
```

### Post-conditional loops

```python
length = f(N)
   for initial
      L = if (N >= 0)
           0
      else
           1
   repeat
      N = old N / 10
      L = old L + 1
   while N /= 0
   returns value of L
```

```python
foo = f(N, T)
   for initial
      i = 0
      s = 0
      t = T
   repeat
      s = old s + old i
      i = if (t>0)
          old i + t
      else
          old i + 1
   while ( (s <= N) & (old i <= 100) )
   returns value of s
```

## Type casting
Types are converted with the following polymorphic functions:

- `integer` -- converts other primitive types and string to integer.
- `double` -- converts other primitive types and string to double.
- `string` -- converts primitive types to string.
- `stream` -- converts array to stream.

## Range generators

List of natural numbers could be generated with special syntax: `[2..100]`. Left border should be less than right, right might be absent, in this case the stream is infinite: `[1..]` (stream of natural numbers).

## Standard library

`sin`, `cos`, `sqrt`, `pow` -- accepting and returning double values.

## Modularity

Definitions from other files are imported with `import`, it takes a string and returns a record, containing all top-level definitions from the given file.

```python
A = import("library.sis")
main = f()
  A.main()
```

## Interaction with external world

Sisal program is getting values as input arguments, streams should be used in of case interactive application. Please refer to specific interpreter or compiler for the details.
