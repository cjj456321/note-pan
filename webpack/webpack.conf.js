// Webpack 配置
const _ = require('lodash')
const glob = require('glob')
const path = require('path')
const webpack = require('webpack')
const merge = require('webpack-merge')
const eslintFormatter = require('eslint-friendly-formatter')
const ExtractTextPlugin = require('extract-text-webpack-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const config = require('./config')
const utils = require('./utils')

// 输出被双引号包裹的字符串
const stringify = JSON.stringify

// 项目根路径
const ROOT = config.ROOT

// 调试/开发模式
const DEBUG = config.DEBUG

// 多页应用入口
const entry = {}
glob
  .sync(ROOT + '/src/*.js')
  .forEach((file) => {
    const chunk = path.basename(file, 'Entry.js')
    entry[chunk] = file
  })

const webpackConfig = {
  devtool: DEBUG ? false : '#source-map',
  entry,
  output: {
    path: ROOT + '/dist', // 必须是绝对路径
    publicPath: '/', // url 前缀
    filename: 'static/duobao/v2/js/[name].[chunkhash].js', // 相对 output.path
    chunkFilename: 'static/duobao/v2/js/[id].[chunkhash].js' // 相对 output.path
  },
  resolve: {
    extensions: ['', '.js', '.vue'],
    loaderExtensions: ['.js', ''],
    alias: {
      'core-js': path.resolve(ROOT, 'node_modules/babel-runtime/node_modules/core-js'),
      // 'lodash': path.resolve(ROOT, 'node_modules/lodash/lodash.min.js'),
      // 'moment': path.resolve(ROOT, 'node_modules/moment/min/moment-with-locales.min.js'),
      // 'urijs': path.resolve(ROOT, 'node_modules/urijs/src/URI.min.js'),
      'vue': path.resolve(ROOT, 'node_modules/vue/dist/vue.min.js'),
      'vuex': path.resolve(ROOT, 'node_modules/vuex/dist/vuex.min.js')
    },
    modulesDirectories: ['node_modules'],
    fallback: [path.resolve(ROOT, 'node_modules')]
  },
  externals: {
    jweixin: 'jWeixin',
    lodash: '_',
    moment: 'moment',
    swiper: 'Swiper',
    urijs: 'URI',
    zepto: 'Zepto'
  },
  resolveLoader: {
    fallback: [path.resolve(ROOT, 'node_modules')]
  },
  module: {
    noParse: [
      // /lodash\.min\.js/,
      // /moment-with-locales\.min\.js/,
      /vue\.min\.js/,
      /vuex\.min\.js/
    ],
    preLoaders: [
      {
        test: /\.vue$/,
        loader: 'eslint',
        include: ROOT,
        exclude: /node_modules/
      },
      {
        test: /\.js$/,
        loader: 'eslint',
        include: ROOT,
        exclude: /node_modules/
      }
    ],
    loaders: [
      {
        test: /\.vue$/,
        loader: 'vue'
      },
      {
        test: /\.js$/,
        loader: 'babel',
        include: ROOT,
        exclude: /node_modules/
      },
      {
        test: /\.scss$/,
        loader: 'autoprefixer!sass'
      },
      {
        test: /\.json$/,
        loader: 'json'
      },
      {
        test: /\.html$/,
        loader: 'vue-html'
      },
      {
        test: /\.(png|jpe?g|gif|svg)(\?.*)?$/,
        loader: 'url',
        query: {
          limit: DEBUG ? 1 : 10000,
          name: 'static/duobao/v2/img/[name].[hash:7].[ext]' // relative to output.path
        }
      }
    ].concat(
      utils.styleLoaders({
        sourceMap: !DEBUG,
        extract: true
      })
    )
  },
  vue: {
    loaders: utils.cssLoaders({
      sourceMap: !DEBUG,
      extract: true
    })
  },
  eslint: {
    formatter: eslintFormatter
  },
  plugins: [
    new webpack.DefinePlugin({
      // 'process.env.DEBUG': DEBUG
      'process.env.DEBUG': true
    }),
    new webpack.optimize.CommonsChunkPlugin({
      name: 'vendors', // 将公共模块提取，生成名为`vendors`的chunk
      chunks: _.keys(entry), //提取哪些模块共有的部分
      minChunks: 3 // 提取至少3个模块共有的部分
    }),
    DEBUG ? function () {} : new webpack.optimize.UglifyJsPlugin({
      compress: {
        warnings: false
      }
    }),
    new webpack.optimize.OccurenceOrderPlugin(),
    new ExtractTextPlugin('static/duobao/v2/css/[name].[contenthash].css') // 相对 output.path
  ].concat(
    _.map(entry, (filename, chunk) => {
      const kebabName = _.kebabCase(chunk);
      const options = {
        filename: `templates/duobao/v2/${kebabName}.html`, // 相对 output.path
        template: ROOT + '/index.html',
        inject: true,
        chunks: ['vendors', chunk],
        minify: DEBUG ? undefined : {
          removeComments: true,
          collapseWhitespace: true,
          removeAttributeQuotes: true,
          minifyJS: {
            output: { quote_style: 1 }
          }
        }
      }
      return new HtmlWebpackPlugin(options)
    })
  ),
  profile: true
}

module.exports = webpackConfig
