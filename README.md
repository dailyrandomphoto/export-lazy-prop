# export-lazy-prop

[![NPM Version][npm-version-image]][npm-url]
[![LICENSE][license-image]][license-url]
[![Build Status][travis-image]][travis-url]
[![code style: prettier][code-style-prettier-image]][code-style-prettier-url]

Export a [lazily evaluated](https://en.wikipedia.org/wiki/Lazy_evaluation) property.

## Installation

```sh
npm install export-lazy-prop
```

## Usages

```js
// util/index.js
exports.foo = require("./foo");
exports.bar = require("./bar");

// some.js
const util = require("./util");
// foo.js and bar.js are loaded

util.foo();
```

In this case, even if `bar.js` is not used, it will still be loaded from the file system.

With `export-lazy-prop`, modules will be loaded on demand.

```js
// util/index.js
const exportLazyProp = require("export-lazy-prop");
exportLazyProp(exports, "foo", () => require("./foo"));
exportLazyProp(exports, "bar", () => require("./bar"));

// some.js
const util = require("./util");
// will not load foo.js and bar.js

util.foo();
// foo.js is loaded
```

Or

```js
// util/index.js
const exportLazyProp = require("export-lazy-prop");
exportLazyProp(exports, {
  foo: () => require("./foo"),
  bar: () => require("./bar"),
});
```

## Related

- [define-lazy-prop](https://github.com/sindresorhus/define-lazy-prop) - Define a lazily evaluated property on an object
- [import-lazy](https://github.com/sindresorhus/import-lazy) - Import a module lazily

## License

Copyright (c) 2019 [dailyrandomphoto][my-url]. Licensed under the [MIT license][license-url].

[my-url]: https://github.com/dailyrandomphoto
[npm-url]: https://www.npmjs.com/package/export-lazy-prop
[travis-url]: https://travis-ci.org/dailyrandomphoto/export-lazy-prop
[license-url]: LICENSE
[code-style-prettier-url]: https://github.com/prettier/prettier
[npm-downloads-image]: https://img.shields.io/npm/dm/export-lazy-prop
[npm-version-image]: https://img.shields.io/npm/v/export-lazy-prop
[license-image]: https://img.shields.io/npm/l/export-lazy-prop
[travis-image]: https://img.shields.io/travis/dailyrandomphoto/export-lazy-prop
[code-style-prettier-image]: https://img.shields.io/badge/code_style-prettier-ff69b4.svg?style=flat-square
