auto-install-webpack-plugin
===========================

A Webpack plugin that automatically installs packages that contain your require'd modules.

Whenever Webpack resolves a requested module, the plugin first checks if the plugin installed and then tries to install the corresponding package using npm.

For example, assuming the package [lodash.times](https://www.npmjs.com/package/lodash.times) is not currently installed, but you require it in your code like this:

```
var times = require("lodash.times");

times(5, function(i) {
  console.log(i);
});
```

Running `webpack` now without using the plugin results in an error because the module cannot be resolved. However, with the plugin enabled `lodash.times` will be automatically installed without forcing you to go to your terminal and execute `npm install lodash.times`.

Automatic installation of packages using the plugin should work in all language that are supporte by the various Webpack loaders.

## Installation ##

`npm install --save-dev auto-install-webpack-plugin`

## Usage ##

Just add an instance of AutoInstallPlugin to your plugins array.

```
var AutoInstallPlugin = require("auto-install-webpack-plugin");

module.exports = {
    context: __dirname,
    entry: "./index",

    output: {
        path: __dirname + "/build",
        filename: "index.js"
    },

    plugins: [
      new AutoInstallPlugin({save: true}),
    ],
};
```

## Configuration ##

You can pass a configuration object to the `AutoInstallPlugin` constructor. The following keys and values are recognized:

* `save`: `true` (default) if the plugin should `--save` the installed package, `false` otherwise.

## Feedback ##

I appreciate any kind of feedback. Just create an issue or drop me a mail. Thanks!

## License ##

See LICENSE.
