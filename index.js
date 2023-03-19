var { typeofValue, types } = require("./src/enum");
var { is, equal } = require("./src/common");

function hasSymbol() {
  var origSymbol = typeof Symbol !== "undefined" && Symbol;
  if (typeof origSymbol !== typeofValue.function) {
    return false;
  }
  if (typeof Symbol !== typeofValue.function) {
    return false;
  }
  if (typeof origSymbol("foo") !== typeofValue.symbol) {
    return false;
  }
  if (typeof Symbol("bar") !== typeofValue.symbol) {
    return false;
  }

  if (
    typeof Symbol !== typeofValue.function ||
    typeof Object.getOwnPropertySymbols !== typeofValue.function
  ) {
    return false;
  }
  if (typeof Symbol.iterator === typeofValue.symbol) {
    return true;
  }

  var obj = {};
  var sym = Symbol("test");
  var symObj = Object(sym);
  if (typeof sym === typeofValue.string) {
    return false;
  }

  if (Object.prototype.toString.call(sym) !== types.symbol) {
    return false;
  }
  if (Object.prototype.toString.call(symObj) !== types.symbol) {
    return false;
  }

  var symVal = 42;
  obj[sym] = symVal;
  for (sym in obj) {
    return false;
  } // eslint-disable-line no-restricted-syntax, no-unreachable-loop
  if (
    typeof Object.keys === typeofValue.function &&
    Object.keys(obj).length !== 0
  ) {
    return false;
  }

  if (
    typeof Object.getOwnPropertyNames === typeofValue.function &&
    Object.getOwnPropertyNames(obj).length !== 0
  ) {
    return false;
  }

  var syms = Object.getOwnPropertySymbols(obj);
  if (syms.length !== 1 || syms[0] !== sym) {
    return false;
  }

  if (!Object.prototype.propertyIsEnumerable.call(obj, sym)) {
    return false;
  }

  if (typeof Object.getOwnPropertyDescriptor === typeofValue.function) {
    var descriptor = Object.getOwnPropertyDescriptor(obj, sym);
    if (descriptor.value !== symVal || descriptor.enumerable !== true) {
      return false;
    }
  }

  return true;
}

//判断类型的工厂类
function isBaseTypeFactory(t, callback) {
  return function (a) {
    //优先使用 typeof 判读，兼容性高，如果基础类型ok，那么直接返回
    if (typeof a === typeofValue[t] && typeof a !== typeofValue.object)
      return true;

    //如果基础类型判断过后，必须为Object, 如果不是返回false
    if (typeof a !== typeofValue.object) return false;

    //判断Object.prototype.toString.call
    if (hasSymbol() && typeof Symbol.toStringTag === typeofValue.symbol) {
      if (Object.prototype.toString.call(a) !== types[t]) {
        return false;
      }
    }

    //通过 callback 每个方法自己决定怎么判断
    if (!!callback) {
      let result = callback(a);
      if (result === true) return true;
    }

    return false;
  };
}

var isString = isBaseTypeFactory(typeofValue.string, function (a) {
  try {
    String.prototype.valueOf.call(a);
    return true;
  } catch {
    return false;
  }
});

var isNumber = function (a) {
  if (is(a, NaN) || isNaN(a) || isInfinity(a)) return false;
  return isBaseTypeFactory("number")(a);
};

var isNaN = function (a) {
  return is(a, NaN);
};

var isInfinity = function (a) {
  return is(a, Infinity) || is(a, -Infinity);
};

var isBoolean = isBaseTypeFactory(typeofValue.boolean, function (a) {
  try {
    Boolean.prototype.valueOf.call(a);
    return true;
  } catch {
    return false;
  }
});

function isUndefined(a) {
  return a === undefined;
}

function isNull(a) {
  return a === null;
}

var isSymbol = isBaseTypeFactory("symbol", function (a) {
  return false;
});

var isDate = isBaseTypeFactory("date", function (a) {
  try {
    Date.prototype.getDay.call(a);
    Date.prototype.getTime.call(a);
    return true;
  } catch {
    return false;
  }
});

var isError = isBaseTypeFactory("error", function (a) {
  return true;
});

var throwRegexMarker = function () {
  throw isRegexMarker;
};

var isRegex = (function () {
  var isRegexMarker = {};
  var throwRegexMarker = function () {
    throw isRegexMarker;
  };

  var badStringifier = {
    toString: throwRegexMarker,
    valueOf: throwRegexMarker,
  };

  if (hasSymbol() && typeof Symbol.toPrimitive === "symbol") {
    badStringifier[Symbol.toPrimitive] = throwRegexMarker;
  }

  return isBaseTypeFactory("regExp", function (a) {
    if (!(a instanceof RegExp)) {
      return false;
    }

    var desc = Object.getOwnPropertyDescriptor(a, "lastIndex");
    if (desc && desc.hasOwnProperty("value")) {
      try {
        RegExp.prototype.exec.call(a, badStringifier);
      } catch (e) {
        return e === isRegexMarker;
      }
    }
    return false;
  });
})();

var isArguments = isBaseTypeFactory("arguments", function (a) {
  return (
    typeof a === typeofValue.arguments &&
    typeof a.length === typeofValue.number &&
    a.length >= 0 &&
    !(a instanceof Array)
  );
});

//nodejs
function isBuffer(a) {
  return !!(
    !!a &&
    a.constructor &&
    a.constructor.isBuffer &&
    a.constructor.isBuffer(a)
  );
}

var isArrayBuffer = (function () {
  var hasArrayBuffer = typeof ArrayBuffer === "function";
  if (hasArrayBuffer) {
    try {
      hasArrayBuffer = !!ArrayBuffer.prototype.byteLength;
    } catch {
      hasArrayBuffer = false;
    }
    if (hasArrayBuffer === false) {
      try {
        hasArrayBuffer = !!ArrayBuffer.prototype.slice;
      } catch {
        hasArrayBuffer = false;
      }
    }
  }

  return isBaseTypeFactory("arrayBuffer", function (a) {
    if (typeof a !== typeofValue.ArrayBuffer) return false;
    if (hasArrayBuffer) {
      try {
        return !!a.byteLength >= 0 && !!a.slice(0);
      } catch {
        return false;
      }
    }
    return false;
  });
})();

var isArray = isBaseTypeFactory("array", function (a) {
  return Array.isArray(a);
});

var isSet = (function () {
  var $set = typeof Set === "function" && Set.prototype ? Set : null;
  var $map = typeof Map === "function" && Map.prototype ? Map : null;
  var $setHas = $set ? Set.prototype.has : null;
  var $mapHas = $map ? Map.prototype.has : null;

  return isBaseTypeFactory("set", function (a) {
    if (!a || typeof a !== typeofValue.set) {
      return false;
    }

    if (!$set || !$setHas) return false;

    try {
      $setHas.call(a);
    } catch (e) {
      return false;
    }

    try {
      $mapHas.call(a);
    } catch {
      return true;
    }

    return a instanceof $set;
  });
})();

var isMap = (function () {
  var $set = typeof Set === "function" && Set.prototype ? Set : null;
  var $map = typeof Map === "function" && Map.prototype ? Map : null;
  var $setHas = $set ? Set.prototype.has : null;
  var $mapHas = $map ? Map.prototype.has : null;

  return isBaseTypeFactory("map", function (a) {
    if (!a || typeof a !== typeofValue.map) {
      return false;
    }

    if (!$map || !$mapHas) return false;

    try {
      $mapHas.call(a);
    } catch (e) {
      return false;
    }

    try {
      $setHas.call(a);
    } catch {
      return true;
    }

    return a instanceof $map;
  });
})();

var isWeakSet = (function () {
  var $weakSet =
    typeof WeakSet === "function" && WeakSet.prototype ? WeakSet : null;
  var $weakMap =
    typeof WeakMap === "function" && WeakMap.prototype ? WeakMap : null;
  var $setHas = $weakSet ? WeakSet.prototype.has : null;
  var $mapHas = $weakMap ? WeakMap.prototype.has : null;

  return isBaseTypeFactory("weakSet", function (a) {
    if (!a || typeof a !== typeofValue.weakSet) {
      return false;
    }

    if (!$weakSet || !$setHas) return false;

    try {
      $setHas.call(a);
    } catch {
      return false;
    }

    try {
      $mapHas.call(a);
    } catch {
      return true;
    }

    return a instanceof $weakSet;
  });
})();

var isWeakMap = (function () {
  var $weakSet =
    typeof WeakSet === "function" && WeakSet.prototype ? WeakSet : null;
  var $weakMap =
    typeof WeakMap === "function" && WeakMap.prototype ? WeakMap : null;
  var $setHas = $weakSet ? WeakSet.prototype.has : null;
  var $mapHas = $weakMap ? WeakMap.prototype.has : null;

  return isBaseTypeFactory("weakMap", function (a) {
    if (!a || typeof a !== typeofValue.weakMap) {
      return false;
    }

    if (!$weakMap || !$mapHas) return false;

    try {
      $mapHas.call(a);
    } catch {
      return false;
    }

    try {
      $setHas.call(a);
    } catch {
      return true;
    }

    return a instanceof $weakMap;
  });
})();

module.exports = {
  hasSymbol,
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
  isNaN,
  isInfinity,
};
