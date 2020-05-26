const _ = require('lodash');

module.exports = function (config) {
  return _.merge({}, config, {
    config: {
      appId: 'com.sadrasamadi.metaman',
      productName: 'Metaman (Metadata Manager)',
      fileAssociations: {
        ext: 'metaman'
      }
    }
  });
};
