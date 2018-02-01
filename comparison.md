# Syntax comparison

The example below is strait-forward matrix multiplication.

## Classic Sisal

```python
function Main( A,B: array[array[real]];  M,N,L : integer returns array[array[real]] )
  for i in 1, M cross j in 1, L
  returns array of
      for k in 1, N repeat
	R := A[i,k] * B[k,j]
      returns sum of R
      end for
  end for
end function
```

## Sisal-IS

```python
main = f(a,b,m,n,l)
  for i,j in [1..m],[1..l]
  returns array of for k in [1..n]
      r = a[i,k] * b[k,j]
  returns sum of r
```
