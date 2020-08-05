'use strict';

const defineValueProperty = (object, propertyName, value) =>
  Object.defineProperty(object, propertyName, {
    value,
    configurable: false,
    enumerable: true,
    writable: false
  });

const defineLazyProperty = (object, propertyName, fn) =>
  Object.defineProperty(object, propertyName, {
    configurable: true,
    enumerable: true,
    get() {
      const result = fn();
      defineValueProperty(object, propertyName, result);
      return result;
    },
    set() {
      throw new TypeError(
        `Cannot assign to read only property '${propertyName}' of object '#<Object>'`
      );
    }
  });

const exportLazyProp = (object, propertyName, fn) => {
  if (typeof propertyName === 'object') {
    const properties = propertyName;
    for (const key in properties) {
      if (Object.prototype.hasOwnProperty.call(properties, key)) {
        exportLazyProp(object, key, properties[key]);
      }
    }

    return object;
  }

  if (typeof propertyName !== 'string') {
    throw new TypeError('propertyName must be a string!');
  }

  return typeof fn === 'function'
    ? defineLazyProperty(object, propertyName, fn)
    : defineValueProperty(object, propertyName, fn);
};

module.exports = (object, propertyName, fn) =>
  exportLazyProp(object, propertyName, fn);
