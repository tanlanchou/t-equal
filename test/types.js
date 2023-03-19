var assert = require("assert");
var {
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
} = require("../src/index");

var commonFalseParams = [
  undefined,
  null,
  0,
  NaN,
  Infinity,
  "foo",
  Object(42),
  [],
  {},
  function () {},
  /a/g,
  new RegExp("a", "g"),
  new Date(),
];

function test(arr, expect, testFunc) {
  arr.forEach((v) => {
    it(String(v), function () {
      assert(testFunc(v) === expect);
    });
  });
}

describe("types 测试开始", function () {
  console.log("Node version is: " + process.version);

  describe(`Symbol环境测试`, function () {
    it("hasSymbol()", function () {
      assert(hasSymbol() !== false);
    });
  });

  describe(`isString判断`, function () {
    var trueParams = [new String(1), "adbdefg123"];
    var falseParams = [
      undefined,
      null,
      false,
      true,
      [],
      {},
      function () {},
      /a/g,
      new RegExp("a", "g"),
      new Date(),
      42,
      Object(42),
      NaN,
      Infinity,
      new Number(1),
    ];

    test(trueParams, true, isString);
    test(falseParams, false, isString);
  });

  describe("isNumber", function () {
    var fixtures = [
      0xff,
      5e3,
      0,
      0.1,
      -0.1,
      -1.1,
      37,
      3.14,
      1,
      1.1,
      10,
      10.1,
      100,
      -100,
      Math.LN2,
      parseInt("012"),
      parseFloat("012"),
      Math.abs(1),
      Math.acos(1),
      Math.asin(1),
      Math.atan(1),
      Math.atan2(1, 2),
      Math.ceil(1),
      Math.cos(1),
      Math.E,
      Math.exp(1),
      Math.floor(1),
      Math.LN10,
      Math.LN2,
      Math.log(1),
      Math.LOG10E,
      Math.LOG2E,
      Math.max(1, 2),
      Math.min(1, 2),
      Math.PI,
      Math.pow(1, 2),
      Math.pow(5, 5),
      Math.random(1),
      Math.round(1),
      Math.sin(1),
      Math.sqrt(1),
      Math.SQRT1_2,
      Math.SQRT2,
      Math.tan(1),
      Number.MAX_VALUE,
      Number.MIN_VALUE,
      +"",
      +1,
      +3.14,
      +37,
      +5,
      +[],
      +false,
      +Math.LN2,
      +true,
      +null,
      +new Date(),
    ];

    falseParams = [
      "0.1",
      "-0.1",
      "-1.1",
      "0",
      "012",
      "0xff",
      "1",
      "1.1",
      "10",
      "10.10",
      "100",
      "5e3",
      "   56\r\n  ",
      "0.0",
      "0x0",
      "0e+5",
      "000",
      "0.0e-5",
      "0.0E5",
      "   ", // issue#3
      "\r\n\t", // issue#3
      "",
      "",
      "3a",
      "abc",
      "false",
      "null",
      "true",
      "undefined",
      +"abc",
      +/foo/,
      +[1, 2, 4],
      +Infinity,
      +Math.sin,
      +NaN,
      +undefined,
      +{ a: 1 },
      +{},
      /foo/,
      [1, 2, 3],
      [1],
      [],
      true,
      false,
      +function () {},
      function () {},
      Infinity,
      -Infinity,
      Math.sin,
      NaN,
      new Date(),
      null,
      undefined,
      {},
    ];
    test(fixtures, true, isNumber);
    test(falseParams, false, isNumber);
  });

  describe("isBoolean测试", function () {
    var falseParams = [
      undefined,
      null,
      0,
      NaN,
      Infinity,
      "foo",
      Object(42),
      [],
      {},
      function () {},
      /a/g,
      new RegExp("a", "g"),
      new Date(),
    ];

    var trueParams = [true, new Boolean(false), false, !0, new Boolean(true)];

    test(falseParams, false, isBoolean);
    test(trueParams, true, isBoolean);
  });

  describe("isUndefined", function () {
    var falseParams = ["test", null, {}, [], 1];
    var trueParams = [, undefined];
    test(falseParams, false, isUndefined);
    test(trueParams, true, isUndefined);
  });

  describe("isNull", function () {
    var falseParams = commonFalseParams.filter((v) => v !== null);
    var trueParams = [null];
    test(falseParams, false, isNull);
    test(trueParams, true, isNull);
  });

  describe("isSymbol", function () {
    var falseParams = commonFalseParams;
    var trueParams = [Symbol(), Symbol.for("a")];
    test(falseParams, false, isSymbol);
    test(trueParams, true, isSymbol);
  });

  describe("isDate", function () {
    var falseParams = commonFalseParams.slice(0, commonFalseParams.length - 1);
    // var realDate = new Date();
    // var fakeDate = {
    //   toString: function () {
    //     return String(realDate);
    //   },
    //   valueOf: function () {
    //     return realDate.getTime();
    //   },
    // };
    // fakeDate[Symbol.toStringTag] = "Date";
    // falseParams.push(fakeDate);
    var trueParams = [new Date()];
    test(falseParams, false, isDate);
    test(trueParams, true, isDate);
  });

  describe(`isError`, function () {
    var falseParams = [
      null,
      undefined,
      false,
      { message: "hi" },
      true,
      false,
      1,
      "string",
    ];

    var trueParams = [new Error("foo"), Error("foo")];

    test(falseParams, false, isError);
    test(trueParams, true, isError);
  });

  describe(`isRegex`, function () {
    let falseParams = [
      "",
      undefined,
      null,
      false,
      true,
      42,
      "foo",
      [],
      {},
      function () {},
    ];

    var regex = /a/g;
    var fakeRegex = {
      toString: function () {
        return String(regex);
      },
      valueOf: function () {
        return regex;
      },
    };
    fakeRegex[Symbol.toStringTag] = "RegExp";
    falseParams.push(fakeRegex);

    var Handler = function () {
      this.trapCalls = [];
    };
    [
      "defineProperty",
      "deleteProperty",
      "get",
      "getOwnPropertyDescriptor",
      "getPrototypeOf",
      "has",
      "isExtensible",
      "ownKeys",
      "preventExtensions",
      "set",
      "setPrototypeOf",
    ].forEach(function (trapName) {
      Handler.prototype[trapName] = function () {
        this.trapCalls.push(trapName);
        return Reflect[trapName].apply(Reflect, arguments);
      };
    });

    var handler = new Handler();
    var proxy = new Proxy({ lastIndex: 0 }, handler);

    falseParams.push(proxy);

    let trueParams = [/a/g, new RegExp("a", "g")];

    test(falseParams, false, isRegex);
    test(trueParams, true, isRegex);
  });

  describe("", () => {
    let fakeOldArguments = {
      callee: function () {},
      length: 3,
    };
    var args = (function () {
      return arguments;
    })();
    args[Symbol.toStringTag] = "Arguments";
    var obj = {};
    obj[Symbol.toStringTag] = "Arguments";
    let falseParams = [
      { length: 2 },
      Array.prototype.slice.call(arguments),
      fakeOldArguments,
      obj,
    ].concat(commonFalseParams);

    let trueParams = [arguments, args];

    test(falseParams, false, isArguments);
    test(trueParams, true, isArguments);
  });

  describe("isBuffer", () => {
    var falseParams = [
      undefined,
      null,
      "",
      true,
      false,
      0,
      1,
      1.0,
      "string",
      {},
      [],
      function foo() {},
      { isBuffer: null },
      {
        isBuffer: function () {
          throw new Error();
        },
      },
    ];
    var trueParams = [
      (Buffer.from([4]), Buffer.alloc(4), Buffer.allocUnsafeSlow(100)),
    ];

    test(falseParams, false, isBuffer);
    test(trueParams, true, isBuffer);
  });

  describe(`isArray`, function () {
    var obj = {};
    obj[0] = true;
    var falseParams = [
      {},
      null,
      false,
      "",
      "42",
      42,
      34.0,
      123e-5,
      "[]",
      undefined,
      function () {},
      obj,
      arguments,
    ];

    var trueParams = [[], new Array(1), Array(1)];
    test(falseParams, false, isArray);
    test(trueParams, true, isArray);
  });

  describe(`isSet`, function () {
    let falseParams = [
      null,
      undefined,
      true,
      false,
      42,
      0,
      -0,
      NaN,
      Infinity,
      "",
      "foo",
      /a/g,
      [],
      {},
      function () {},
      new Map(),
      new WeakMap(),
      new WeakSet(),
    ];

    let trueParams = [new Set()];
    test(falseParams, false, isSet);
    test(trueParams, true, isSet);
  });

  describe(`isMap`, function () {
    let falseParams = [
      null,
      undefined,
      true,
      false,
      42,
      0,
      -0,
      NaN,
      Infinity,
      "",
      "foo",
      /a/g,
      [],
      {},
      function () {},
      new Set(),
      new WeakMap(),
      new WeakSet(),
    ];

    let trueParams = [new Map()];
    test(falseParams, false, isMap);
    test(trueParams, true, isMap);
  });

  describe(`isWeakSet`, function () {
    let falseParams = [
      null,
      undefined,
      true,
      false,
      42,
      0,
      -0,
      NaN,
      Infinity,
      "",
      "foo",
      /a/g,
      [],
      {},
      function () {},
      new Set(),
      new WeakMap(),
      new Map(),
    ];

    let trueParams = [new WeakSet()];
    test(falseParams, false, isWeakSet);
    test(trueParams, true, isWeakSet);
  });

  describe(`isMap`, function () {
    let falseParams = [
      null,
      undefined,
      true,
      false,
      42,
      0,
      -0,
      NaN,
      Infinity,
      "",
      "foo",
      /a/g,
      [],
      {},
      function () {},
      new Set(),
      new WeakSet(),
      new Map(),
    ];

    let trueParams = [new WeakMap()];
    test(falseParams, false, isWeakMap);
    test(trueParams, true, isWeakMap);
  });
});
