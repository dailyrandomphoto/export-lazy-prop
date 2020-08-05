'use strict';
const exportLazyProp = require('export-lazy-prop');
const global = require('../global.js');

global.someUtilLoaded = true;
// exports.moduleA = require('../module-a.js');
// exports.moduleB = require('../module-b.js');
// exports.moduleC = require('../module-c.js');
// exports.moduleD = { abc: 'abc' };

exportLazyProp(exports, 'moduleA', () => require('../module-a.js'));
exportLazyProp(exports, {
  moduleB: () => require('../module-b.js'),
  moduleC: () => require('../module-c.js'),
  moduleD: { abc: 'abc' }
});
