var AutoInstallPlugin = require("../index.js");

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