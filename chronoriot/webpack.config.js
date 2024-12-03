var path = require("path")

module.exports = {
    entry: './src/index.js',
    output: {
        path: path.resolve(__dirname),
        filename: '__bundle.js'
    }
};