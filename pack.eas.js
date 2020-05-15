const _ = require('lodash');

module.exports = function (config) {
  return _.merge({}, config, {
    config: {
      fileAssociations: {
        ext: 'metaman'
      }
    }
  });
}
