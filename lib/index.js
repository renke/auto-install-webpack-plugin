require("babel/polyfill");

import resolve from "resolve";
import {exec} from "child_process";

class AutoInstallPlugin {
  constructor(config={save: true}) {
    this.config = config;
    this.resetMemory();
  }

  resetMemory() {
    this.memory = new Set();
  }

  apply(compiler) {
    compiler.plugin("done", this.resetCache);

    compiler.resolvers.normal.plugin("module", (req, next) => {
      var packageName = req.request.split("/")[0];

      if (this.memory.has(packageName)) {
        return;
      } else {
        this.memory.add(packageName);
      }

      // Check if package is already installed
      resolve(packageName, {basedir: req.path}, (err, res) => {
        if (err) {
          let command = this.buildCommand(packageName);
          console.log(command);

          // console.log(`Installing missing package ${packageName}…`);

          exec(command, (err, stdout, stderr) => {
            if (err) {
              // print(stderr.toString())
              next();

            } else {
              print(stdout.toString());
              next(null, {path: resolve.sync(packageName, {basedir: req.path}), resolved: true});
            }
          });

        } else {
          // Nothing to do for us here
          next();
        }
      });
    })
  }

  buildCommand(packageName) {
    if (this.config.save) {
      return `npm i --save ${packageName}`;
    }

    return `npm i ${packageName}`;
  }
}

function print(output) {
  console.log(output.trim());
}

export default AutoInstallPlugin;