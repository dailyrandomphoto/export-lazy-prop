'use strict';

const chai = require('chai');
chai.use(require('chai-as-promised'));
const { expect } = chai;
const exportLazyProp = require('export-lazy-prop');
const global = require('./src/global.js');
const resetCache = require('resnap')(); // Capture require() cache state

describe('export-lazy-prop', () => {
  beforeEach(() => {
    global.reset();
    resetCache();
  });

  it('should export a function as a proterty', () => {
    exportLazyProp(exports, 'foo', () => [1, 2, 3]);
    expect(exports.foo).to.be.eql([1, 2, 3]);

    expect(global.aLoaded).to.be.a('undefined');
    exportLazyProp(exports, 'moduleA', () => require('./src/module-a.js'));
    expect(global.aLoaded).to.be.a('undefined');
    expect(exports.moduleA).to.be.eql({ foo: 'bar' });
    expect(global.aLoaded).to.be.eql(true);
  });

  it('should export properties when provide an object as input', () => {
    exportLazyProp(exports, {
      abc: [1, 2, 3],
      bar: { bor: 'bar' }
    });
    expect(exports.abc).to.be.eql([1, 2, 3]);
    expect(exports.bar).to.be.eql({ bor: 'bar' });

    expect(global.bLoaded).to.be.a('undefined');
    expect(global.cLoaded).to.be.a('undefined');
    exportLazyProp(exports, {
      moduleB: () => require('./src/module-b.js'),
      moduleC: () => require('./src/module-c.js')
    });
    expect(global.bLoaded).to.be.a('undefined');
    expect(global.cLoaded).to.be.a('undefined');

    expect(exports.moduleB).to.be.eql({ foo: 'bar' });
    expect(exports.moduleC).to.be.eql({ foo: 'bar' });
    expect(global.bLoaded).to.be.eql(true);
    expect(global.cLoaded).to.be.eql(true);
  });

  it('should load the module file when export as a proterty', () => {
    expect(global.aLoaded).to.be.a('undefined');
    expect(global.bLoaded).to.be.a('undefined');
    expect(global.cLoaded).to.be.a('undefined');
    const util = require('./src/example1/some-util.js');
    expect(global.aLoaded).to.be.eql(true);
    expect(global.bLoaded).to.be.eql(true);
    expect(global.cLoaded).to.be.eql(true);
    expect(util.moduleA).to.be.eql({ foo: 'bar' });
  });

  it('should not load the module file when export as a proterty lazily', () => {
    expect(global.aLoaded).to.be.a('undefined');
    expect(global.bLoaded).to.be.a('undefined');
    expect(global.cLoaded).to.be.a('undefined');
    const util = require('./src/example2/some-util.js');
    expect(global.aLoaded).to.be.a('undefined');
    expect(global.bLoaded).to.be.a('undefined');
    expect(global.cLoaded).to.be.a('undefined');
    expect(util.moduleA).to.be.eql({ foo: 'bar' });
  });

  it('should load the module file when access the property', () => {
    expect(global.aLoaded).to.be.a('undefined');
    expect(global.bLoaded).to.be.a('undefined');
    expect(global.cLoaded).to.be.a('undefined');
    const util = require('./src/example2/some-util.js');
    expect(global.aLoaded).to.be.a('undefined');
    expect(global.bLoaded).to.be.a('undefined');
    expect(global.cLoaded).to.be.a('undefined');

    // access module a
    expect(util.moduleA).to.be.eql({ foo: 'bar' });
    expect(global.aLoaded).to.be.eql(true);
    expect(global.bLoaded).to.be.a('undefined');
    expect(global.cLoaded).to.be.a('undefined');

    // access module b
    expect(util.moduleB.foo).to.be.eql('bar');
    expect(global.bLoaded).to.be.eql(true);
    expect(global.cLoaded).to.be.a('undefined');
  });

  it('should load the module file when access the property (2)', () => {
    expect(global.someUtilLoaded).to.be.a('undefined');
    expect(global.aLoaded).to.be.a('undefined');
    expect(global.bLoaded).to.be.a('undefined');
    expect(global.cLoaded).to.be.a('undefined');
    const util = require('./src/example2');
    expect(global.someUtilLoaded).to.be.eql(true);
    expect(global.aLoaded).to.be.a('undefined');
    expect(global.bLoaded).to.be.a('undefined');
    expect(global.cLoaded).to.be.a('undefined');

    // access module a
    expect(util.moduleA).to.be.eql({ foo: 'bar' });
    expect(global.someUtilLoaded).to.be.eql(true);
    expect(global.aLoaded).to.be.eql(true);
    expect(global.bLoaded).to.be.a('undefined');
    expect(global.cLoaded).to.be.a('undefined');

    // access module b
    expect(util.moduleB.foo).to.be.eql('bar');
    expect(global.bLoaded).to.be.eql(true);
    expect(global.cLoaded).to.be.a('undefined');
  });

  it('should be impossible to change the exported properties', () => {
    expect(global.aLoaded).to.be.a('undefined');
    expect(global.bLoaded).to.be.a('undefined');
    expect(global.cLoaded).to.be.a('undefined');
    const util = require('./src/example2/some-util.js');
    expect(global.aLoaded).to.be.a('undefined');
    expect(global.bLoaded).to.be.a('undefined');
    expect(global.cLoaded).to.be.a('undefined');

    expect(util.moduleA).to.be.eql({ foo: 'bar' });
    // Try to change the loaded module.
    expect(() => {
      util.moduleA = { foz: 'baz' };
    }).to.be.throw(TypeError);
    expect(util.moduleA).to.be.eql({ foo: 'bar' });

    // Try to change a module that has not been loaded.
    expect(() => {
      util.moduleB = { foz: 'baz' };
    }).to.be.throw(TypeError);
    expect(util.moduleB).to.be.eql({ foo: 'bar' });

    expect(util.moduleD).to.be.eql({ abc: 'abc' });
    expect(() => {
      util.moduleD = { cde: 'cde' };
    }).to.be.throw(TypeError);
  });
});
