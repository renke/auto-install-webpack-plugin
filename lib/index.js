require("babel/polyfill");

import validatePackageName from "validate-npm-package-name";
import bluebird from "bluebird";

import {exec} from "child_process";

const resolve = bluebird.Promise.promisify(require("resolve"));

class AutoInstallPlugin {
  constructor(config={save: true, saveExact: false}) {
    this.config = config;
    this.resetMemory();
  }

  resetMemory() {
    this.memory = new Set();
  }

  apply(compiler) {
    compiler.plugin("done", this.resetMemory);

    compiler.resolvers.normal.plugin("module", (req, next) => {
      var packageName = req.request.split("/")[0];

      // Make sure we only install a package once
      if (this.memory.has(packageName)) {
        return next();
      } else {
        this.memory.add(packageName);
      }

      // Avoid trying to install packages with invalid name
      if (!validatePackageName(packageName).validForNewPackages) {
        return next();
      }

      resolve(packageName, {basedir: req.path}).then(res => {
        next(); // Already installed
      }).catch(() => {
        let command = this.buildCommand(packageName);

        exec(command, (err, stdout, stderr) => {
          if (err) return next();

          console.log(command);
          print(stdout.toString());

          resolve(packageName, {basedir: req.path}).then(([path]) => {
            next(null, resolveRequest(req, path));
          }).catch(err => {
            next();
          });
        });
      }).catch(err => {
        next();
      });
    })
  }

  buildCommand(packageName) {
    var command = ['npm', 'install', packageName];
    
    if (this.config.save) {
      command.push('--save');
    }
    if (this.config.saveExact) {
      command.push('--save-exact');
    }

    return command.join(' ');
  }
}

function resolveRequest(oldRequest, resolvedPath) {
  return Object.assign({}, oldRequest, {
    path: resolvedPath,
    resolved: true,
  })
}

function print(output) {
  console.log(output.trim());
}

export default AutoInstallPlugin;
