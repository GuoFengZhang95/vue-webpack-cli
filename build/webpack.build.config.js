const Webpack = require('webpack')
const { merge } = require('webpack-merge')
const BaseConfig = require('./webpack.base.config')
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin') //将CSS提取为独立的文件的插件，对每个包含css的js文件都会创建一个CSS文件，支持按需加载css和sourceMap
const TerserWebpackPlugin = require('terser-webpack-plugin')
const { CleanWebpackPlugin } = require('clean-webpack-plugin') //打包前删除dist文件夹

module.exports = entry => {
  let { mode, env } = entry
  if (env === 'prod') {
    env = ''
  }
  const prodConfig = {
    mode: 'production',
    // devtool: env ? 'eval-source-map' : false,
    devtool: env ? 'nosources-source-map' : false,
    optimization: {
      minimize: true, //生产模式下默认为true 执行优化操作
      minimizer: [
        new CssMinimizerPlugin(),
        new TerserWebpackPlugin()
      ],
      splitChunks: {
        chunks: 'all',
        cacheGroups: {
          libs: {
            name: 'chunk-libs',
            test: /[\\/]node_modules[\\/]/,
            priority: 10,
            chunks: 'initial', // only package third parties that are initially dependent
          },
          antDesignVue: {
            name: 'chunk-ant-design-vue', // 单独打包 ant-design-vue
            test: /[\\/]node_modules[\\/]_?ant-design-vue(.*)/, // 兼容cnpm
            priority: 20, //
          },
          lodash: {
            name: 'lodash', // 单独打包 ant-design-vue
            test: /[\\/]node_modules[\\/]_?lodash(.*)/,
            priority: 30, //
          },
          vue: {
            name: 'vue', // 单独打包 ant-design-vue
            test: /[\\/]node_modules[\\/]vue/,
            priority: 30, //
          },
          vuex: {
            name: 'vuex', // 单独打包 ant-design-vue
            test: /[\\/]node_modules[\\/]vuex/,
            priority: 40, //
          },
          vueRouter: {
            name: 'vue-router', // 单独打包 ant-design-vue
            test: /[\\/]node_modules[\\/]vue-router/,
            priority: 50, //
          },
        },
      },
    },
    module: {
      rules: [
        {
          test: /\.(c|sc|le|sa)ss$/,
          use: [
            {
              loader: MiniCssExtractPlugin.loader,
            },
          ],
        },
      ],
    },
    plugins: [
      new Webpack.DefinePlugin({
        'process.env.MODE': JSON.stringify(mode),
        'process.env.ENV': JSON.stringify(env),
      }),
      new MiniCssExtractPlugin({
        filename: 'css/[name][contenthash].css',
        ignoreOrder: true,
      }),
      new CleanWebpackPlugin(),
    ],
  }
  return merge(prodConfig, BaseConfig)
}
