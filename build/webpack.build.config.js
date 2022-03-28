const baseConfig = require('./webpack.base.config')
const { merge } = require('webpack-merge')
const CssMinimizerPlugin = require("css-minimizer-webpack-plugin");
const MiniCssExtractPlugin = require('mini-css-extract-plugin') //将CSS提取为独立的文件的插件，对每个包含css的js文件都会创建一个CSS文件，支持按需加载css和sourceMap
const TerserWebpackPlugin = require('terser-webpack-plugin')
const webpack = require('webpack')

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
        new TerserWebpackPlugin(),
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
              options: {
                publicPath: '../../',
              },
            },
          ],
        },
      ],
    },
    plugins: [
      new webpack.DefinePlugin({
        'process.env.MODE': JSON.stringify(mode),
        'process.env.ENV': JSON.stringify(env)
      }),
      new MiniCssExtractPlugin({
        filename: 'css/[name][contenthash].css',
        ignoreOrder: true,
      }),
    ],
  }
  return merge(prodConfig, baseConfig)
}
