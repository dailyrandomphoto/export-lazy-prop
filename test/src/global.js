const store = {};
store.reset = () => {
  for (const key in store) {
    if (Object.prototype.hasOwnProperty.call(store, key) && key !== 'reset') {
      delete store[key];
    }
  }
};

module.exports = store;
