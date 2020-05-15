const _ = require('lodash');

let org = {
  a: 'A',
  o: {
    b: 'B',
    c: 'C'
  }
};
let obj = _.merge({}, org, {
  d: 'D',
  o: {
    b: null,
    e: 'E'
  }
});
console.log(org);
console.log(obj);
console.log(org === obj);
