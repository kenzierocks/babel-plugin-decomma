babel-plugin-decomma
====================

Removes comma expressions.

### Example
Input:
```javascript
const val = (0, a.func)();
const nested = (1, (2, (3, NaN)));
if ((0, b.bar)()) {
}
```
Output:
```javascript
0;
const val = a.func();
1;
2;
3;
const nested = NaN;
0;
if (b.bar()) {
}
```
Currently no optimization is performed, like removing the constant values that are not assigned to anything. This is on the TODO list.
