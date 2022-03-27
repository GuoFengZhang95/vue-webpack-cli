const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin') //生成dist文件夹下的html模板
const { CleanWebpackPlugin } = require('clean-webpack-plugin') //打包前删除dist文件夹
const VueLoaderPlugin = require('vue-loader/lib/plugin') //将定义过的其它规则复制并应用到 .vue 文件里相应语言块

const CopyWebpackPlugin = require('copy-webpack-plugin')

module.exports = {
  entry: [path.resolve(__dirname, '../src/main.js')],
  // entry: ['@babel/polyfill', path.resolve(__dirname, '../src/main.js')],
  output: {
    path: path.resolve(__dirname, '../dist'),
    filename: 'static/js/[name][contenthash].js',
    publicPath: '/',
  },
  resolve: {
    alias: {
      // vue$: "vue/dist/vue.esm.js", //加上这一句
      '@': path.resolve(__dirname, '../src'),
    },
    extensions: ['.vue', '.js', '.scss', '.json'],
  },
  module: {
    rules: [
      // {
      //   enforce: 'pre',
      //   test: /\.(js|vue)$/,
      //   exclude: /node_modules/,
      //   use: ['eslint-loader'],
      // },
      {
        test: /\.m?js$/,
        exclude: function (modulePath) {
          if (/node_modules/.test(modulePath) && !/vuex/.test(modulePath)) {
            return modulePath
          }
        },
        use: {
          loader: "babel-loader",
        }
      },
      {
        test: /\.vue$/,
        loader: 'vue-loader',
      },
      {
        test: /\.(ttf|eot|woff|woff2)$/,
        use: 'url-loader',
      },
      {
        test: /\.(c|sc|le|sa)ss$/,
        use: [
          {
            loader: 'css-loader',
          },
          // {
          //   loader: 'postcss-loader',
          // },
          {
            loader: 'less-loader',
            options: {
              lessOptions: {
                modifyVars: {
                  'primary-color': '#00C7DB',
                },
                javascriptEnabled: true,
              },
            },
          },
        ],
      },
      {
        test: /\.(png|jpg|gif|webp|svg)$/,
        use: [
          {
            loader: 'url-loader',
            options: {
              esModule: false,
              limit: 10000,
              fallback: 'file-loader',
              outputPath: 'static/images/',
            },
          },
        ],
      },
    ],
  },
  plugins: [
    new HtmlWebpackPlugin({
      filename: 'index.html', //生成的文件名称
      template: path.resolve(__dirname, '../src/index.html'), //模版源绝对路径
    }),
    new CleanWebpackPlugin(),
    new CopyWebpackPlugin({
      patterns: [
        {
          from: path.resolve(__dirname, '../public/static'),
          to: path.resolve(__dirname, '../dist/static'),
        },
      ],
    }),
    new VueLoaderPlugin(),
  ],
}
