# webpack

## 为什么是 webpack

简单的说这是主流社区对下一代生态系统构建工具的最终选择, 



### 快速入门

### 思考

#### CSS 模块化

基于这套模块化系统(尤其是 React 的书写组件风格需要), 我们需要一种新的方式使用 CSS:

`mod.css`

```css
.className {
  color: green;
}
```

`mod.js`

```js
import styles from './mod.css'
// import { className } from './mod.css'

element.innerHTML = '<div class="' + styles.className + '">'
```

这实际上是 [CSS Modules](https://github.com/css-modules/css-modules) 官方给出的示例, 在此之前我们有 [BEM](http://getbem.com/) 或是 [SUIT](http://suitcss.github.io/) 的命名规范来约束, 但都不是真正的模块化方案, **CSS Modules** 一举解决了作用域, 变量, 组合等问题, 真正带来了 CSS 的拐点, 当然它太新了, 用在大型项目上可能还有很多风险

#### 一些常规优化

- 

#### 如何优化编译速度

首次编译时动辄几百 ms(`hot` 模式下由于有缓存速度很快), 非常影响开发体验, 优化思路就是调试耗时部分, 尽量减少模块树解析查找, 尤其是第三方模块一般都会提供打包好的版本, 如果不是需要在开发时查看源码, 尽量使用打包好的版本

首先开启 debug 信息, 分析耗时部分:

```
--profile 输出性能数据，可以看到每一步的耗时
--display-modules 默认情况下 node_modules 下的模块会被隐藏，加上这个参数可以显示这些被隐藏的模块
```

以 `moment.js` 为例, 我们通过:

```js
import moment from 'moment'
```

引入的是 `moment.js` 的入口文件, 在编译过程会引入大量的子文件导致耗时, 注意到 `moment.js` 提供了打包后的版本 `min/moment.min.js`, 我们可以直接引入:

```js
import moment from 'moment/min/moment-with-locales.min.js'
```

更佳的做法是使用 webpack 的别名:

```js
resolve: {
  alias: {
    moment: 'moment/min/moment-with-locales.min.js'
  }
}
```

这样引用就被替换为了打包后的文件:

```js
// ref to moment/min/moment-with-locales.min.js by alias
import moment from 'moment'
```

另外, 由于 `moment-with-locales.min.js`, `moment-with-locales.js` 这几个文件我们很清楚是打包后的, 不需要再进行解析和查找依赖, 可以配置跳过解析, 更加提高编译速度:

```js
module: {
  noParse: [/moment-with-locales/]
}
```

### 实际应用

> 我们开始构建一个能覆盖 webpack 常规的功能的 App `webpack-example`

1. 首先考虑要实现哪些任务

    - **build** - 将源码编译为可在浏览器允许的代码
    - **dev** - 开发模式, 主要是实现快速的热更新
    - **test** - 自动测试及代码检查
    - **deploy** - 优化产出最终代码和资源, 并且部署发布

    基于 `gulp` 可以轻松创建这些任务:

    ```js
    gulp.task('build', () => {})
    gulp.task('dev', () => {})
    gulp.task('test', () => {})
    gulp.task('deploy', () => {})
    ```

    然后我们将这些任务的入口加入到 `package.json`, 这样可以方便的通过 `npm run dev` 来执行, 同时这也是其他生态系统的默认执行方式

    ```json
    "scripts": {
      "test": "gulp test",
      "build": "gulp build",
      "dev": "gulp dev",
      "deploy": "gulp deploy --production"
    }
    ```

2. 设计目录结构

    ```
    .
    ├── dist
    │   └── webpack-example
    ├── gulpfile.babel.js
    ├── package.json
    ├── public
    │   └── webpack-example
    ├── src
    │   └── webpack-example
    └── webpack
        └── webpack.dev.config.js
        └── webpack.deploy.config.js
    ```

    其中

    - `webpack` 目录放置不同环境下的 webpack 配置文件
    - `src` 目录下是所有开发的文件, 本例命名了一个 `webpack-example` App 作为示例
    - `dist` 是由 `src` 编译产出物, 用于开发环境执行
    - `public` 是最终优化完的静态资源, 可以直接分发至线上或 CDN 服务器

### 几个坑

#### 关于 chunk 地址

```html
<script src="bundle.js"></script>
```

在调试过程中 `bundle.js` 并不是一个落地的文件, 只是 server 生成的文件流, 这样更新代码的速度能很快, 所以在 html 里的路径并不是期望的生成路径, 如果想将 `src` 中的路径改为 `js/bundle.js` 需要修改 webpack config 中的 `publicPath` 告诉 server 生成文件流的地址, 否则请求错误的 `bundle.js` 不会触发重新编译

```js
output: {
  path: path.join(paths.dist, 'webpack-example/js'),
  filename: 'bundle.js',
  publicPath: 'js'
}
```

#### 启用 `hot` 模式

> 在 node api 内开启 `hot` 模式, 需要通过添加 plugin 的方式:

```
plugins: [
  new webpack.HotModuleReplacementPlugin()
],
```

配置参数 `hot: true` 报错如下:

```
Uncaught Error: [HMR] Hot Module Replacement is disabled.
```

> 恐怕是当前版本 (1.10.1) 的 bug

#### 关于 `inline` 模式

> 开启 `hot` 模式后, 任何跟 `entry` 有关的改动都会触发重新编译, 因为有模块缓存, 重新编译的速度非常快, 但是我们还想做到浏览器自动刷新, 官方提供了 2 种做法, 实际都是与 server 建立 socket 连接, 实现通知

- 第一种方式是访问: http://localhost:8080/webpack-dev-server/index.html

这种方式实际是访问一个已经建立了 socket 连接的模板页, 我们实际的页面是通过 `iframe` 方式内嵌进行实现自动刷新, 感觉非常不靠谱, 页面一旦复杂了, `iframe` 方式造成的影响会很大

- 第二种方式是手动添加内联的 socket 客户端代码

```html
<script src="http://localhost:8080/webpack-dev-server.js"></script>
```

同样让人感觉遗憾, 竟然不支持自动注入, 发布生成环境时还需要移除这些调试代码, 由于目前是静态页面的演示, 我们就先使用这种方式, 在发布时通过 `gulp` 移除
