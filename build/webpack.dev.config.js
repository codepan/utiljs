const HtmlWebpackPlugin = require('html-webpack-plugin')
const { merge } = require('webpack-merge')
const webpackBaseConfig = require('./webpack.base.config')
module.exports = merge(webpackBaseConfig, {
  entry: './test/index.js',
  plugins: [
    new HtmlWebpackPlugin()
  ]
})
