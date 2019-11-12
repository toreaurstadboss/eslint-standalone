### Eslint-standalone

Note - standalone here means a binary for your target platform with Node bundled together

This makes it easier to run Eslint as a command line utility on any platform and integrate into the build process,
showing linting information and fixing up files.

#### Is this Eslint?
No, this is a repackage of Eslint packaged using pkg 
Eslint is licensed as MIT and so is this repository.
https://github.com/eslint/eslint/blob/master/LICENSE

#### What is this ?
A standalone version of Eslint not requiring node installed locally as node is packaged and bundled together using pkg.
pkg is available through npm 
This standalone version is build for node 10 and uses the ecmaVersion 8. This is configurable by editing the .eslintrc file

### How to rebuild this source code using pkg into another standalone ?
Run this command to build another standalone binary:
pkg .
You can also customize builds using pkg:
pkg -t --help

### How to adjust the npm packages that will be built by pkg into the standalone binary ?
This repository includes a package.json file 
Just install the npm packages and update the ones you want or uninstall the ones not desired. Then re-run pkg command.
pkg .

### Can I use this in production environments ? 
Sure, note that there are no warranties whatsoever. 

### How to get started linting ?
Run the standalone executable on your target platform of choice (you must of course build a standalone for your correct platform)
in a folder containing js files
Make sure that you have a .eslintrc.js file nearby.

The following file includes a sample of a .eslintrc.js file:

```javascript
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

```

Copy this contents into your target folder and run the executable

Example Windows 64 platform:


