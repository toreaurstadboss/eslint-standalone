#!/usr/bin/env node

const CLIEngine = require('eslint').CLIEngine;
const minimist = require('minimist');
const path = require('path');
const chalk = require('chalk');
const eslintPluginCompat = require('eslint-plugin-compat');

module.exports = (() => {
  const args = process.argv.slice(2);

  let fix = false;

  console.log('Looking at provided arguments:');
  for (var i = 0; i < args.length; i++) {
    console.log(args[i]);
    if (args[i] === '--fix') {
      fix = true;
      console.log('Fix option provided: ' + fix);
    }
  }

  // Read a default eslint config
  //console.log("Dirname: " + __dirname);

  let configPath = ''
  let baseConfig = ''
  let errorEncountered = false;

  console.info('Trying to resolve .eslintrc.js file')

  try {
    console.info('..Trying local folder')
    configPath = path.resolve(__dirname + './eslintrc.js');
    baseConfig = require('./.eslintrc.js');
  }
  catch (error) {
    console.info(error);
    errorEncountered = true;
  }

  // Check if the path to a client config was specified
  if (args.conf) {
    if (Array.isArray(args.conf)) {
      const error = chalk.bold.redBright(`> eslint requires a single config file`);
      errorEncountered = true;
      console.warn(error);
    }

    try {
      configPath = path.resolve(process.cwd(), args.conf);
      baseConfig = require(configPath);
      errorEncountered = false;
    } catch (error) {
      errorEncountered = true;
      console.log(error);
    }
  } else {
    // Check if a client app has .eslintrc.js in the root directory
    try {
      configPath = path.resolve(process.cwd(), '.eslintrc.js');
      baseConfig = require(configPath);
      errorEncountered = false;
    } catch (error) {
      errorEncountered = true;
      console.log(error);
    }
  }

  if (errorEncountered === true) {
    try {
      let knownHomeDirectoryOnOSes = process.env.HOME || process.env.HOMEPATH || process.env.USERPROFILE;
      let knownHomeDirectoryOnOSesNormalized = path.normalize(knownHomeDirectoryOnOSes + '/.eslintrc')
      configPath = path.resolve(knownHomeDirectoryOnOSesNormalized);
      baseConfig = `{
        "extends": "${configPath}"         
      }`;

      errorEncountered = false;
    } catch (error) {
      errorEncountered = true;
      console.error(error);
      process.exitCode = 1; //signal an error has occured. https://stackoverflow.com/questions/5266152/how-to-exit-in-node-js
      return;
    }
  }

  console.log(`> eslint has loaded config from: ${configPath}`);

  console.log('base config: ');
  console.log(baseConfig);

  const cli = new CLIEngine({ baseConfig });
  let filesDir = [];

  if (args.dir) {
    // Dir can be a string or an array, we do a preprocessing to always have an array
    filesDir = []
      .concat(args.dir)
      .map((item) => path.resolve(process.cwd(), item));
  } else {
    filesDir = ['./']
  }

  console.log(`> eslint is checking the following dir: ${filesDir}`);

  const report = cli.executeOnFiles(filesDir);

  if (report.errorCount > 0) {
    const formatter = cli.getFormatter();

    console.log(chalk.bold.redBright(`> eslint has found ${report.errorCount} error(s)`));
    console.log(formatter(report.results));

    return;
  }

  console.log(chalk.bold.greenBright('> eslint finished without any errors!'));
})();