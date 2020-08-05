'use strict';
const global = require('./global.js');

console.log('load module-b');
global.bLoaded = true;

module.exports = { foo: 'bar' };
