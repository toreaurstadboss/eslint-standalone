module.exports = {
  "plugins": [
    "ie11",
    "html"
  ],
  "parser": "babel-eslint",
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
    "ie11/no-weak-collections": ["error"],
    "curly": ["off"]
  }
};

//A list of rules that can be applied is here: https://eslint.org/docs/rules/
//The rules can have the following severity in EsLint: "warn", "error" and "off".
