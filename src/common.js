
function equal(a, b, opt) {
  return opt.strict ? is(a, b) : a === b;
}

function is(a, b) {
  if (Object && Object.is && typeof Object.is === "function")
    return Object.is(a, b);

  if (a === b) {
    return a !== 0 || b !== 0 || 1 / a === 1 / b;
  } else {
    return a !== a && b !== b;
  }
}

module.exports = { equal, is };
