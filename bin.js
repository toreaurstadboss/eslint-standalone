#!/usr/bin/env node

const CLIEngine = require("eslint").CLIEngine;
const minimist = require("minimist");
const path = require("path");
const chalk = require("chalk");
const eslintPluginCompat = require("eslint-plugin-compat");
const eslintIe11 = require("eslint-plugin-ie11");
const fs = require("fs");
const { promisify } = require("util");

const fsAccessAsync = promisify(fs.access);

var runEsLint = function(baseConfig, args) {
  const cli = new CLIEngine({ baseConfig });

  let filesDir = [];

  if (args.dir) {
    // Dir can be a string or an array, we do a preprocessing to always have an array
    filesDir = []
      .concat(args.dir)
      .map((item) => path.resolve(process.cwd(), item));
  } else {
    filesDir = ["./."];
  }

  console.log(`> eslint is checking the following dir: ${filesDir}`);

  const report = cli.executeOnFiles(filesDir);

  if (report.errorCount > 0) {
    const formatter = cli.getFormatter();

    console.log(
      chalk.bold.redBright(`> eslint has found ${report.errorCount} error(s)`)
    );
    console.log(formatter(report.results));

    process.exitCode = 1; //eslint errors encountered means the process should exit not with exit code 0.

    return;
  }
  console.log(chalk.bold.greenBright("> eslint finished without any errors!"));
  process.env.exitCode = 0; //exit with success code

}

var tryLoadConfigViaKnownSystemFolder = function(){

  let configFileFound = null;
try {
  let knownHomeDirectoryOnOSes =
    process.env.HOME || process.env.HOMEPATH || process.env.USERPROFILE;
  let knownHomeDirectoryOnOSesNormalized = path.normalize(
    knownHomeDirectoryOnOSes + "/.eslintrc"
  );
  configPath = path.resolve(knownHomeDirectoryOnOSesNormalized);
  if (checkIfFileExistsAndIsAccessible(configPath)){
    configFileFound = true;
    errorEncountered = false;
  }

} catch (error) {
  errorEncountered = true;
  console.error(error);  
  process.exitCode = 1; //signal an error has occured. https://stackoverflow.com/questions/5266152/how-to-exit-in-node-js
  return configFileFound;
}

};


var checkIfFileExistsAndIsAccessible = function(configPathFull) {
  try {
   fs.accessSync(configPathFull, fs.F_OK);
  return true;
  }
  catch (Error){
    return false;
   }  
}


var tryLoadFileInDirectoryStructure = function(curDir){

  let configFullPathFound = null;
  for (let i = 0; i < 100; i++) {
    try {
      if (i > 0) {
        console.info("Trying lib folder of eslint-standalone: " + curDir);
        let oldCurDir = curDir;
        curDir = path.resolve(curDir, ".."); //parent folder
        if (oldCurDir == curDir) {
          //at the top of media disk volume - exit for loop trying to retrieve the .eslintrc.js file from parent folder
          console.info(
            "It is recommended to save an .eslintrc.js file in the folder structure where you run this tool."
          );
          break;
        }
      }
      configPath = path.join(curDir + "/.eslintrc.js");
      configPath = path.normalize(configPath);
      if (checkIfFileExistsAndIsAccessible(configPath)){
       baseConfig = require(configPath);
       errorEncountered = false;
       configFullPathFound = configPath;
       break; //exit the for loop
      }
    } catch (error) {
      process.stdout.write(".");
      errorEncountered = true;
    }
  }
  return configFullPathFound;
}

var inspectArgs = function(args) {
  let fix = false;

  console.log("Looking at provided arguments:");
  for (var i = 0; i < args.length; i++) {
    console.log(args[i]);
    if (args[i] === "--fix") {
      fix = true;
      console.log("Fix option provided: " + fix);
      console.warn("Fix is not supported yet, you must manually adjust the files."
      );
    }
  }
}


module.exports = (() => {
  const args = process.argv.slice(2);

  inspectArgs(args); 

  // Read a default eslint config
  //console.log("Dirname: " + __dirname);

  let configPath = "";
  let baseConfig = "";
  let errorEncountered = false;

  console.info("Trying to resolve .eslintrc.js file");

  console.info("Trying current working directory:", process.cwd());

  let curDir = process.cwd();

  let configFilefound = tryLoadFileInDirectoryStructure(curDir);
  
  if (configFilefound === null) {
   curDir = __dirname;
   configFilefound = tryLoadFileInDirectoryStructure(curDir);
  }

  // try {
  //   configPath = path.join(curDir + "/.eslintrc.js");
  //   configPath = path.normalize(configPath);
  //   baseConfig = require(configPath);

  //   console.info("Found config file in current working folder");

  //   errorEncountered = false;
  //   configFilefound = baseConfig !== "";
  // } catch (error) {
  //   //ignore error handling for now at working folder
  //   configFilefound = false;
  // }

  // if (!configFilefound) {
  //   curDir = __dirname;

  //   for (let i = 0; i < 100; i++) {
  //     try {
  //       if (i > 0) {
  //         console.info("Trying lib folder of eslint-standalone: " + curDir);
  //         let oldCurDir = curDir;
  //         curDir = path.resolve(curDir, ".."); //parent folder
  //         if (oldCurDir == curDir) {
  //           //at the top of media disk volume - exit for loop trying to retrieve the .eslintrc.js file from parent folder
  //           console.info(
  //             "It is recommended to save an .eslintrc.js file in the folder structure where you run this tool."
  //           );
  //           break;
  //         }
  //       }
  //       configPath = path.join(curDir + "/.eslintrc.js");
  //       configPath = path.normalize(configPath);
  //       baseConfig = require(configPath);
  //       errorEncountered = false;
  //       break; //exit the for loop
  //     } catch (error) {
  //       process.stdout.write(".");
  //       errorEncountered = true;
  //     }
  //   }
  // }

  // Check if the path to a client config was specified
  if (args.conf) {
    if (Array.isArray(args.conf)) {
      const error = chalk.bold.redBright(
        `> eslint requires a single config file`
      );
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
  }

  if (errorEncountered === true) {
    configFileFound = tryLoadConfigViaKnownSystemFolder();
    if (configFileFound !== null) {
      baseConfig = `{
        "extends": "${configPath}"         
      }`;    
    }
    // try {
    //   let knownHomeDirectoryOnOSes =
    //     process.env.HOME || process.env.HOMEPATH || process.env.USERPROFILE;
    //   let knownHomeDirectoryOnOSesNormalized = path.normalize(
    //     knownHomeDirectoryOnOSes + "/.eslintrc"
    //   );
    //   configPath = path.resolve(knownHomeDirectoryOnOSesNormalized);
    

    //   errorEncountered = false;
    // } catch (error) {
    //   errorEncountered = true;
    //   console.error(error);
    //   process.exitCode = 1; //signal an error has occured. https://stackoverflow.com/questions/5266152/how-to-exit-in-node-js
    //   return;
    // }
  }

  console.log(`> eslint has loaded config from: ${configFilefound}`);

  runEsLint(baseConfig, args);

  // console.log('base config: ');
  // console.log(baseConfig);

  // const cli = new CLIEngine({ baseConfig });

  // let filesDir = [];

  // if (args.dir) {
  //   // Dir can be a string or an array, we do a preprocessing to always have an array
  //   filesDir = []
  //     .concat(args.dir)
  //     .map((item) => path.resolve(process.cwd(), item));
  // } else {
  //   filesDir = ["./."];
  // }

  // console.log(`> eslint is checking the following dir: ${filesDir}`);

  // const report = cli.executeOnFiles(filesDir);

  // if (report.errorCount > 0) {
  //   const formatter = cli.getFormatter();

  //   console.log(
  //     chalk.bold.redBright(`> eslint has found ${report.errorCount} error(s)`)
  //   );
  //   console.log(formatter(report.results));

  //   process.exitCode = 1; //eslint errors encountered means the process should exit not with exit code 0.

  //   return;
  // }
  // console.log(chalk.bold.greenBright("> eslint finished without any errors!"));
  // process.env.exitCode = 0; //exit with success code
})();


