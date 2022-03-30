const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin') //生成dist文件夹下的html模板
const VueLoaderPlugin = require('vue-loader/lib/plugin') //将定义过的其它规则复制并应用到 .vue 文件里相应语言块
const CopyWebpackPlugin = require('copy-webpack-plugin')
const WebpackBar = require('webpackbar')
const ESLintPlugin = require('eslint-webpack-plugin')
module.exports = {
  entry: [path.resolve(__dirname, '../src/main.js')],
  output: {
    path: path.resolve(__dirname, '../dist'),
    filename: 'js/[name][contenthash].js',
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
      // js
      {
        test: /\.m?js$/,
        exclude: /node_modules/,
        use: {
          loader: "babel-loader",
        }
      },
      // vue
      {
        test: /\.vue$/,
        loader: 'vue-loader',
      },
      // css
      {
        test: /\.(c|sc|le|sa)ss$/,
        use: [
          {
            loader: 'css-loader',
          },
          {
            loader: 'postcss-loader',
          },
          {
            loader: 'less-loader',
          },
        ],
      },
      // image
      {
        test: /\.(png|jpg|gif|webp|svg|ico)$/,
        type: 'asset', // 代替file-loader url-loader
        // type: 'asset/resource' 代替file-loader
        // type: 'asset/inline' 代替url-loader
        // type: 'asset/source' 代替raw-loader
        generator: {
          filename: 'images/[hash][ext]'
        }
      },
      // font
      {
        test: /\.(ttf|eot|woff|woff2)$/,
        type: 'asset',
      },
    ],
  },
  plugins: [
    new HtmlWebpackPlugin({
      filename: 'index.html', //生成的文件名称
      template: path.resolve(__dirname, '../src/index.html'), //模版源绝对路径
      // favicon: path.resolve(__dirname, '../public/favicon.ico') 使用这种方式感觉和CopyWebpackPlugin的范围冲突（实际不影响，但是模板html不能放在public文件夹下面）
    }),
    new CopyWebpackPlugin({
      patterns: [
        {
          from: path.resolve(__dirname, '../public'),
          to: path.resolve(__dirname, '../dist/public'),
        },
      ],
    }),
    new ESLintPlugin({
      extensions: ['js', 'vue'],
      exclude: ['node_modules'],
      threads: 4,
      fix: true
    }),
    new VueLoaderPlugin(),
    new WebpackBar()
  ],
}
