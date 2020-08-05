'use strict';
const global = require('./global.js');

console.log('load module-c');
global.cLoaded = true;

module.exports = { foo: 'bar' };
