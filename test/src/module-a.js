'use strict';
const global = require('./global.js');

console.log('load module-a');
global.aLoaded = true;

module.exports = { foo: 'bar' };
