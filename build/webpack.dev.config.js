const baseConfig = require('./webpack.base.config')
const { merge } = require('webpack-merge')
const openInEditor = require('launch-editor-middleware')
const webpack = require('webpack')

module.exports = entry => {
  console.log('entry', entry)
  const { mode, env } = entry
  const devServerConfig = {
    mode: 'development',
    devtool: 'eval-source-map',
    devServer: {
      host: 'mysaas.17m17.com',
      hot: true,
      open: false,
      https: true,
      port: 443,
      stats: 'errors-only',
      historyApiFallback: true,
      proxy: {
        '/mall-api': {
          target: `https://mall-api${env}.mumuxili.com`,
          changeOrigin: true,
          pathRewrite: { '^/mall-api': '' },
        },
        '/vip-api': {
          target: `https://vip${env}.mumuxili.com`,
          changeOrigin: true,
          pathRewrite: { '^/vip-api': '' },
        },
        '/login-api': {
          target: `https://login-api${env}.mumuxili.com`,
          changeOrigin: true,
          pathRewrite: { '^/login-api': '' },
        },
        '/api-api': {
          target: `https://api${env}.mumuxili.com`,
          changeOrigin: true,
          pathRewrite: { '^/api-api': '' },
        },
        '/service-login-api': {
          target: `https://login${env}.mumuxili.com`,
          changeOrigin: true,
          pathRewrite: { '^/service-login-api': '' },
        },
        '/mis-service': {
          target: `https://mis-service${env}.mumuxili.com`,
          changeOrigin: true,
          pathRewrite: { '^/mis-service': '' },
        },
        '/yqmm-api': {
          target: `https://yqmm-api${env}.mumuxili.com`,
          changeOrigin: true,
          pathRewrite: { '^/yqmm-api': '' },
        },
        '/login-api': {
          target: `https://login-api${env}.mumuxili.com`,
          changeOrigin: true,
          pathRewrite: { '^/login-api': '' },
        },
        '/app-web-api': {
          target: `https://app-web${env}.17m17.com`,
          changeOrigin: true,
          pathRewrite: { '^/app-web-api': '' },
        },
        '/yqmm-service-api': {
          target: `https://yqmm-service${env}.mumuxili.com`,
          changeOrigin: true,
          pathRewrite: { '^/yqmm-service-api': '' },
        },
      },
      before(app) {
        // 指定在那种编辑器中打开组件
        app.use('/__open-in-editor', openInEditor('code'))
      }
    },
    module: {
      rules: [
        {
          test: /\.(c|sc|le|sa)ss$/,
          use: [
            {
              loader: 'style-loader',
            },
          ],
        },
      ],
    },
    plugins: [
      new webpack.DefinePlugin({
        'process.env.MODE': JSON.stringify(mode),
        'process.env.ENV': JSON.stringify(env)
      })
    ],
  }
  return merge(devServerConfig, baseConfig)
}
