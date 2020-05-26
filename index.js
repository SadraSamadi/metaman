const f = function g() {
  console.log(f, g);
  console.log(f === g);
};

f();
