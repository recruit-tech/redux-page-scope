import assert from 'assert';

const storage = {};

global.window = {
  sessionStorage: {
    getItem(key) {
      return storage[key];
    },
    setItem(key, value) {
      storage[key] = value;
    },
    removeItem(key) {
      delete storage[key];
    },
  },
};

export default function (src) {
  return () => {
    const prefix = '@@redux-page-scope/';
    const expect = Object.keys(src).reduce((result, key) => {
      result[prefix + key] = JSON.stringify({ counter: { value: src[key] } });
      return result;
    }, {});
    assert.deepEqual(storage, expect);
  };
}
