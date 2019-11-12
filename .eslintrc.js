module.exports = {
  extends: 'eslint-config-standard',
  env: { node: true },
  "parserOptions": {
        "ecmaVersion": 8,
        "sourceType": "module"
    },
  rules: {
    "semi": "off",
    "space-before-function-paren": "off"
  },
  plugins: ['json']
};