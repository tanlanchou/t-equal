# 类型判断

判断类型是否只指定的类型。

```
let {
  isString,
  isNumber,
  isBoolean,
  isUndefined,
  isNull,
  isSymbol,
  isDate,
  isError,
  isRegex,
  isArguments,
  isBuffer,
  isArrayBuffer,
  isArray,
  isSet,
  isMap,
  isWeakSet,
  isWeakMap,
} = require("t_valid_type");

console.log(isString(`a`));
```