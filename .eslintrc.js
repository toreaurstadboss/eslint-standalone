module.exports = {
  "plugins": ["ie11"],
  "env": {
    "browser": true,
    "node": true,
    "es6": false
  },
  "parserOptions": {
    "ecmaVersion": 5,
  },
  "rules": {
    "ie11/no-collection-args": ["error"],
    "ie11/no-for-in-const": ["error"],
    //"ie11/no-loop-func": ["warn"],
    "ie11/no-weak-collections": ["error"]
  }
};

