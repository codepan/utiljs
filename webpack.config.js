const path = require('path')

module.exports = {
  mode: 'development',
  entry: './src/index.js',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'utiljs.umd.min.js',
    library: 'utiljs',
    libraryTarget: 'umd',
    libraryExport: 'default',
    globalObject: 'this'
  }
}