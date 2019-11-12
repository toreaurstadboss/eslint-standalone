#!/usr/bin/env node

const CLIEngine = require('eslint').CLIEngine;
const minimist = require('minimist');
const path = require('path');
const chalk = require('chalk');

module.exports = (() => {
  const args = minimist(process.argv.slice(2));

  // Read a default eslint config
  console.log("Dirname: " + __dirname);
  let configPath = path.resolve(__dirname, '.eslintrc.js');
  let baseConfig = require(configPath);

  // Check if the path to a client config was specified
  if (args.conf) {
    if (Array.isArray(args.conf)) {
      const error = chalk.bold.redBright(`> eslint requires a single config file`);

      return console.log(error);
    }

    try {
      configPath = path.resolve(process.cwd(), args.conf);
      baseConfig = require(configPath);
    } catch (error) {
      return console.log(error);
    }
  } else {
    // Check if a client app has .eslintrc.js in the root directory
    try {
      configPath = path.resolve(process.cwd(), '.eslintrc.js');
      baseConfig = require(configPath);
    } catch (error) {
      return console.log(error);
    }
  }

  console.log(`> eslint has loaded config from: ${configPath}`);

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