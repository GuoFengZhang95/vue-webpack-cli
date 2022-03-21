## 项目名称

> 仪器买卖-分销系统

## 运行条件

> 列出运行该项目所必须的条件和相关依赖

```json
{
  "name": "vue-template-cms",
  "version": "1.0.0",
  "description": "",
  "private": false,
  "scripts": {
    "local": "webpack-dev-server --env local --config ./build/webpack.local.config.js",
    "build:dev": "webpack --env dev --config ./build/webpack.build.config.js",
    "build:test": "webpack --env test --config ./build/webpack.build.config.js",
    "build:pre": "webpack --env pre --config ./build/webpack.build.config.js",
    "build:prod": "webpack --env prod --config ./build/webpack.build.config.js"
  },
  "keywords": [],
  "author": "",
  "license": "ISC",
  "devDependencies": {
    "@babel/core": "^7.10.2",
    "@babel/plugin-transform-runtime": "^7.10.1",
    "@babel/preset-env": "^7.10.2",
    "@vue/babel-helper-vue-jsx-merge-props": "^1.0.0",
    "@vue/babel-preset-jsx": "^1.1.2",
    "ant-design-vue": "^1.6.2",
    "autoprefixer": "^9.8.2",
    "babel-loader": "^8.1.0",
    "babel-plugin-import": "^1.13.0",
    "babel-polyfill": "^6.26.0",
    "clean-webpack-plugin": "^3.0.0",
    "copy-webpack-plugin": "^6.1.0",
    "css-loader": "^3.5.3",
    "dotenv-webpack": "^2.0.0",
    "file-loader": "^6.0.0",
    "friendly-errors-webpack-plugin": "^1.7.0",
    "html-webpack-plugin": "^4.3.0",
    "jsonp": "^0.2.1",
    "less-loader": "^6.1.2",
    "mini-css-extract-plugin": "^0.9.0",
    "moment": "^2.27.0",
    "nprogress": "^0.2.0",
    "optimize-css-assets-webpack-plugin": "^5.0.3",
    "postcss-loader": "^3.0.0",
    "resize-observer-polyfill": "^1.5.1",
    "speed-measure-webpack-plugin": "^1.3.3",
    "style-loader": "^1.2.1",
    "terser-webpack-plugin": "^3.0.3",
    "url-loader": "^4.1.0",
    "vue-jsonp": "^0.1.8",
    "vue-loader": "^15.9.2",
    "vue-template-compiler": "^2.6.11",
    "webpack": "^4.43.0",
    "webpack-cli": "^3.3.11",
    "webpack-dev-server": "^3.11.0",
    "webpack-merge": "^4.2.2"
  },
  "dependencies": {
    "axios": "^0.19.2",
    "core-js": "^3.6.5",
    "js-cookie": "^2.2.1",
    "vue": "^2.6.11",
    "vue-jsonp": "^0.1.8",
    "vue-router": "^3.3.2",
    "vuex": "^3.4.0"
  }
}
```

## 运行说明

> 说明如何运行和使用你的项目，建议给出具体的步骤说明

1. ```js
   npm install
   ```

2. ```js
   npm run local
   ```

## 技术架构

> 技术选型

- vue2+vuex+vue-router+axios+ant-design-vue

- webpack4+webpack-cli3

## 协作者

> @zevan @bourne

## 插件

### GlobalDrawer

> #### 介绍

> #### 属性

> #### 事件

## 组件

### BottomOperations

> #### 介绍

列表页顶部操作栏：包换调整间距和跳页的功能

> #### 属性

| 参数            | 说明                         | 类型    | 默认值 | 版本 |
| --------------- | ---------------------------- | ------- | ------ | ---- |
| totalCount      | 总数量                       | Number  | 0      |      |
| current         | 当前页                       | Number  | 1      |      |
| showSizeChanger | 是否显示每页展示数量的选择器 | Boolean | true   |      |

> #### 事件

| 名称                | 说明          | 回调参数                  | 版本 |
| ------------------- | ------------- | ------------------------- | ---- |
| tablePageChange     | 改变页码      | `function(page,pageSize)` |      |
| tablePageSizeChange | pageSize 变化 | function(page,pageSize)   |      |
|                     |               |                           |      |

### DotStatus

> #### 介绍

文本状态组件

> #### 属性

| 参数      | 说明   | 类型   | 可选值                                                                     | 默认值 | 版本 |
| --------- | ------ | ------ | -------------------------------------------------------------------------- | ------ | ---- |
| text      | 文本值 | String | -                                                                          | -      | -    |
| dotStatus | 状态值 | String | `status_underway`:进行中`status_normal`：已完成`status_abnormal`：异常结束 |        |      |

### ExpressList

> #### 介绍

物流组件

> #### 属性

| 参数        | 说明         | 类型  | 可选值 | 默认值 | 版本 |
| ----------- | ------------ | ----- | ------ | ------ | ---- |
| expressList | 物流数据信息 | Array |        |        |      |

### GlobalReload

> #### 介绍

全局刷新按钮

> #### 事件

| 名称         | 说明     | 回调参数     | 版本 |
| ------------ | -------- | ------------ | ---- |
| parentReload | 刷新方法 | `function`() |      |

### IuputNumber

> #### 介绍

数量输入/增加输入框

> #### 属性

| 参数         | 说明     | 类型    | 可选值 | 默认值 | 版本 |
| ------------ | -------- | ------- | ------ | ------ | ---- |
| disabled     | 是否禁用 | Boolean | -      | false  | -    |
| defaultValue | 初始值   |         | -      | 0      | -    |
| min          | 最小值   | Number  | -      | -      | -    |
| max          | 最大值   | Number  | -      | -      | -    |
| step         | 步长     | Number  | -      | 1      | -    |

> #### 事件

| 名称         | 说明         | 回调参数           | 版本 |
| ------------ | ------------ | ------------------ | ---- |
| numberChange | 输入框值变化 | `function(newVal)` | -    |

### PageHeader

> #### 介绍

页面标题

> #### 属性

| 参数        | 说明             | 类型    | 可选值 | 默认值 | 版本 |
| ----------- | ---------------- | ------- | ------ | ------ | ---- |
| title       | 一级标题         | String  | -      | -      | -    |
| subTitle    | 二级标题         | String  | -      | -      | -    |
| showRefresh | 是否展示刷新按钮 | Boolean | -      | true   | -    |
| showBack    | 是否展示返回按钮 | Boolean | -      | false  | -    |

> #### 事件

| 名称         | 说明 | 回调参数     | 版本 |
| ------------ | ---- | ------------ | ---- |
| parentReload | 刷新 | `function()` | -    |
