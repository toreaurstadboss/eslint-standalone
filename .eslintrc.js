module.exports = {
  "extends": ["plugin:compat/recommended"],
  "env": {
    "browser": true,
    "node": true
  },
  "parserOptions": {
    "ecmaVersion": 5,
    "sourceType": "module",
    "ecmaFeatures": {

    }
  },
  "rules": {
    "semi": "off",
    "space-before-function-paren": "off",
    "arrow-body-style": ["error", "always"]
  }
};
