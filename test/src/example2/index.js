'use strict';
const exportLazyProp = require('export-lazy-prop');

// module.exports = require('./some-util.js');
exportLazyProp(module, 'exports', () => require('./some-util.js'));
