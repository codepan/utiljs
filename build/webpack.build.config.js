const glob = require('glob')
const path = require('path')
const { CleanWebpackPlugin } = require('clean-webpack-plugin')
const { merge } = require('webpack-merge')
const { CheckerPlugin } = require('awesome-typescript-loader')
const webpackBaseConfig = require('./webpack.base.config')
const config = {
  mode: 'production',
  // mode: 'development',
  entry: {
    index: './src/index.ts'
  },
  output: {
    path: path.resolve(process.cwd(), 'lib'),
    filename: '[name].js',
    libraryTarget: 'umd'
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: [
          'awesome-typescript-loader',
          'eslint-loader'
        ],
        exclude: /node_modules/
      }
    ]
  },
  plugins: [
    new CleanWebpackPlugin(),
    new CheckerPlugin()
  ]
}

/**
* 动态查找所有入口文件
*/
const files = glob.sync('./src/*/index.ts')
const entries = {}

Array.from(files).forEach((file) => {
  const [match, name] = /.*\/(.*?\/index).ts/.exec(file)
  entries[name] = file
})

config.entry = Object.assign({}, config.entry, entries)

module.exports = merge(webpackBaseConfig, config)
