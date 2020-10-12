### Eslint-standalone

Note - standalone here means a binary for your target platform with Node bundled together

This makes it easier to run Eslint as a command line utility on any platform and integrate into the build process,
showing linting information and fixing up files.

#### Is this Eslint?

No, this is a repackage of Eslint packaged using pkg
Eslint is licensed as MIT and so is this repository.
https://github.com/eslint/eslint/blob/master/LICENSE

#### What is this ?

A standalone tool version of Eslint not requiring node installed locally as node is packaged and bundled together using pkg.
pkg is available through npm
This standalone version is build for node 10 and uses the ecmaVersion 8. This is configurable by editing the .eslintrc.js file
in the current folder. If there is no such file in the current folder, the program will keep looking at parent folders for such a
file. If none are still not found, if will look in the user's home folder - but here the file must be called .eslintrc.

#### Does the tool cover all Eslint usages ?

No. If there are plugins for Eslint that you want to use via the config file, this must be added to this repo. You can fork the repo,
I will not support pull requests for this repo as it is mainly a demo tool. After adding more Npm packages, you can then re-run the Pkg
tool to build a binary executable for your platform, using pkg.

#### Sorry, pkg what ?

Ah yes, pkg. It is a library and command line interface that enables you to package your Node.js project into an executable that can be run on device without Node.js installed. Or one source code that does not use Npm, but you still want to use it to inspect Javascript source code and that it conforms to best practices.

To install the pkg tool, run this:

```bash
npm install -g pkg
```

Tip: If you have installed Chocolatey, run the refreshenv command to reload the path environment variables and then you can run the pkg command afterwards.

#### Why did you make this tool ?

At work I have a large project with many employees working on it, but this project uses not Npm (Actually it use MVC and jQuery+Javascript).
Some of our customers still use old browsers (Internet Explorer 11 for example). I have included an .eslintrc.js file that will detect
and lint against source code of Javscript not using Ecmascript 6, only ES5 syntax. For example, one time we sent off a version to our
customers that did not work. The reason was that we used an arrow function in the source code and Internet Explorer does not support
arrow functions. So I made this tool to be able to inspect such cases.

### How to rebuild this source code using pkg into another standalone ?

Run this command to build another standalone binary:

```bash
pkg .
```

You can also customize builds using pkg:

```bash
pkg -t --help
```

For example, you can build only for Windows platform using this command:

```bash
pkg -t node10-win .
```

### How to adjust the npm packages that will be built by pkg into the standalone binary ?

This repository includes a package.json file
Just install the npm packages and update the ones you want or uninstall the ones not desired. Then re-run pkg command.
Example of basic pkg command (note that this will build binaries for Windows, MacOS and Linux)

```bash
pkg .
```

### Limitations with the tool
EsLint exits on first error encountered in each Javascript file. I have not found a way of getting all errors in a file. So you must 
run the tool and fix the errors and then re-run it. I am trying to look through the EsLint documentation to find how to achieve this. 
Maybe you have a tip for me here?
<a href='https://eslint.org/docs/developer-guide/nodejs-api#cliengine'>https://eslint.org/docs/developer-guide/nodejs-api#cliengine</a>

### Can I use this in production environments ?

Sure, note that there are no warranties whatsoever. One possible use could be on a build server. Note that if the tool finds errors,
the exit code of the process is set to not non-zero (one as exit code instead), so it should throw an error also by exiting the process
and therefore integrate in build environments.

### How to get started linting ?

Run the standalone executable on your target platform of choice (you must of course build a standalone for your correct platform)
in a folder containing js files
Make sure that you have a .eslintrc.js file nearby, in the current folder you execute the tool or in one of the parent folders.
You can use a .eslintrc file in your user's folder, but chances are high that there will be extensions of Eslint not bundled together
with this tool. If that is the case, add more packages to this solution and run pkg again. You can fork this source code easily on Github!

The following file includes a sample of a .eslintrc.js file, detecting support for Internet Explorer by banning ES6 syntax using EsLint:

```javascript
module.exports = {
  plugins: ["ie11", "html"],
  parser: "babel-eslint",
  env: {
    browser: true,
    node: true,
    es6: false,
  },
  parserOptions: {
    ecmaVersion: 5,
  },
  rules: {
    "ie11/no-collection-args": ["error"],
    "ie11/no-for-in-const": ["error"],
    //"ie11/no-loop-func": ["warn"],
    "ie11/no-weak-collections": ["error"],
  },
};
```

The sample file above enforces ES5 syntax via the parserOptions:ecmaVersion json value set to 5. Additional checks for IE11 compatibility is done in the rules json struct part below.

Copy this contents into your target folder in a file called .eslintrc.js and run the executable

Example Windows 64 platform:

```bash
cd c:\eslint\eslint-standalone
REM or where you have clones this repo
eslint-standalone.exe
```

#### Adding the tool to your path environment variable

It is recommended that you add the tool to your path environment variable in your OS. Therefore, you can
run the tool without giving a full path to it. You can run the 'refreshenv' command to refresh the environment variables
in a shell, if you have installed Chocolatey.

<a href='https://wwww.chocolatey.org'>Chocolatey.org</a>

```bash
REM After adding the tool to the path environment variable
eslint-standalone
```

#### How to specify file extensions to use?

Here is how you can specify the file extensions to use as an example:

```bash
eslint-standalone.exe --ext .js,.html,.htm,.cshtml
```

Important, to be able to syntax check with Eslint standalone razor files, use the plugin "html"
and also use the --ext argument specifying the file globs above. This will set the CLI engine options extensions.

Use the --ext option and specify a comma separated list of file extensions to use.

#### Other recommended tools for Visual Studio for linting

Maybe TypeScriptAnalyzer is such a tool. It is port of Web Analyzer, which is only supported in VS 2015.
TypeScriptAnalyzer is supported in VS 2017 and VS 2019.

<a href='https://marketplace.visualstudio.com/items?itemName=RichNewman.TypeScriptAnalyzer'>
https://marketplace.visualstudio.com/items?itemName=RichNewman.TypeScriptAnalyzer</a>

Last update 02.10.2020
