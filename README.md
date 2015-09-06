# ES2015 新的启航

[![Circle CI](https://circleci.com/gh/leecade/es6-study.svg)](https://circleci.com/gh/leecade/es6-study) [![js-standard-style](https://img.shields.io/badge/code%20style-standard-brightgreen.svg?style=flat)](https://github.com/feross/standard)

> **ECMAScript 6** 于 **2015年6⽉18⽇** 正式 [定稿](http://www.ecma-international.org/ecma-262/6.0/ECMA-262.pdf), 发布更名为 **ES2015**, 基于 [babel](https://babeljs.io/) 编译, 终于可以进入生产环境, 而今年的 [React](http://facebook.github.io/react/) 生态大热, 社区开始全面拥抱 ES2015, 作为一个大龄前端码农, 越发感觉这个行业趋于成熟化, 又喜又忧, 不能再待在舒适区自诩经验丰富, 开始拥抱下一代技术栈, 共勉之

-------

较好的学习曲线:

[ES2015](http://www.ecma-international.org/ecma-262/6.0/) -> [babel](https://babeljs.io/) + [webpack](https://webpack.github.io/) -> [React](http://facebook.github.io/react/) -> 重新思考[FP (函数式编程)](https://github.com/MostlyAdequate/mostly-adequate-guide) -> [Flux/Redux](https://github.com/rackt/redux) + [Immutable](https://facebook.github.io/immutable-js/) + [flow](http://flowtype.org/) -> [GraphQL](http://facebook.github.io/graphql/) + [Relay](https://facebook.github.io/relay/)

-------

## 笔记章节导航

- [ES2015 学习](#es2015-学习)
    - [推荐学习资料](#推荐学习资料)
    - [目前生产环境应用情况](#目前生产环境应用情况)
    - [开发环境配置指南](#开发环境配置指南)
    - 测试指南
- babel + webpack
- React
- 重新思考 FP (函数式编程)
- Flux/Redux
- Immutable + flow
- GraphQL + Relay

## ES2015 学习

### 推荐学习资料

- [Overview of ECMAScript 6 features](https://github.com/lukehoban/es6features)

新特性快速入门

- [ECMAScript 6 入门](http://es6.ruanyifeng.com/)

[阮一峰](http://www.ruanyifeng.com) 老师的中文入门指南, 平实易懂

- [es6-2ality](http://www.2ality.com/search/label/esnext)

更多 ES2015 特性的深入介绍

### 目前生产环境应用情况

- node(iojs)

默认启用了[部分特性](https://iojs.org/zh/es6.html), 但实际应用还是需要 babel 编译

- 浏览器端

早些时候 Google 推出了 [traceur](https://github.com/google/traceur-compiler) 编译器, 在 Chrome 上也是积极推动, 但想在浏览器跑原生 ES2015 代码还非常遥远, 但是!! 基于 babel 提供的浏览器端 [runtime](https://babeljs.io/docs/usage/browser/), 允许不经转换直接在浏览执行时处理:

```html
<script src="node_modules/babel-core/browser.js"></script>
<script type="text/babel">
class Test {
  test() {
    return "test";
  }
}

var test = new Test;
test.test(); // "test"
</script>
```

> 注意到压缩后的 `browser.min.js` 仍然有 1.4MB, 所以在生产环境, 还是推荐使用 [webpack](https://webpack.github.io/) 先离线编译, 目前兼容主流浏览器(ie9+), 如果要支持 IE8 需要注意 [一些问题](http://babeljs.io/docs/advanced/caveats/)

### 开发环境配置指南

> 更新: 彻底抛弃 ESLint, 拥抱 [standard](https://github.com/feross/standard), 终于解救了天秤座的纠结之心, 原谅我之前关于 ESLint 的折腾, 理由很充分:
>
> 1. standard 的几条金律少而精, 全部命中我现在的 style, 基本是向后友好的流行风格, 官方坚决不给自定义配置的做法我非常欣赏, 适合大型团队统一风格
>
> 2. 不折腾, 不需要各种配置, 使用相当简单, 配套的自动格式化工具也很成熟, 即使团队成员坚决不适应这套风格也没关系, 提交前自动格式化下好了
>
> 3. 社区成熟度惊人, 拥趸很多, 编辑器 / 构建工具友好, JSX / ES2015 等下一代语言支持非常完善, 不像 ESLint 还得折腾半天

1. 安装

    npm:

    ```sh
    $ npm install standard@latest babel-eslint@latest --save-dev
    ```

    sublime:

    - [SublimeLinter3](https://github.com/SublimeLinter/SublimeLinter3)
    - [SublimeLinter-contrib-standard](https://github.com/Flet/SublimeLinter-contrib-standard)
    - [standard-format](https://github.com/bcomnes/sublime-standard-format) 自动格式化工具

2. 配置

    恭喜你, 安装完成后在 **SublimeLinter3** 中启用 **standard** 即可

    此外一些额外配置可以添加到 `package.json`:

    ```json
    "standard": {
      "parser": "babel-eslint",
      "global": [ "myVar1", "myVar2" ],
      "ignore": [
        "**/out/",
        "/lib/select2/",
        "/lib/ckeditor/",
        "tmp.js"
      ]
    }
    ```

    - `parser` 推荐使用 `babel-eslint` 解析器
    - `global` 忽略的全局变量
    - `ignore` 忽略的文件或目录

> 配置非常简单, 默认会包含 JSX 等 lint 规则, gulp 和 git commit 的支持可以参考 ESLint 的配置, 写完后我会移除掉代码里所有 ESLint 的支持, 有兴趣的可以翻看 git history

----

1. 如何引入 ESLint

    > 最佳实践是本地安装 `eslint`, ([SublimeLinter-eslint](https://github.com/roadhump/SublimeLinter-eslint) 默认支持), 这样做的好处是不需要配置环境变量, 同时可以避免团队成员全局 `eslint` 版本不一致, 也不需要告诉团队成员还有其他依赖需要安装

    ```sh
    $ npm install --save-dev eslint@latest
    ```

2. 使 ESLint 支持 ES2015

    同样为 ESLint 本地安装 babel 解析器 `babel-eslint`:

    ```sh
    $ npm install --save-dev eslint@latest
    ```

    在 `.eslintrc` 中配置解析器:

    ```json
    {
      "parser": "babel-eslint"
    }
    ```

    > 稍后可以在 `.eslintrc` 中添加更多的检查规则, 如果你是 React 的开发者, 推荐集成 React 的 [lint 规则](https://github.com/yannickcr/eslint-plugin-react)

    ```sh
    $ npm install eslint-plugin-react --save-dev
    ```

    在 `.eslintrc` 中配置使用插件:
    
    ```json
    {
      "plugins": [
        "react"
      ],
      "ecmaFeatures": {
        "jsx": true
      },
      "rules": {
        "react/jsx-boolean-value": 1
      }
    }
    ```

3. `gulpfile.babel.js` - gulp 配置

    > `gulp` 已经支持 ES2015 的语法, 需要将配置文件改名为 `gulpfile.babel.js`

    ```js
    import gulp from 'gulp'
    import eslint from 'gulp-eslint'

    gulp.task('lint', () => {
      return gulp.src(['src/**/*.js', 'webpack.config.js', 'gulpfile.js'])
        .pipe(eslint())
        .pipe(eslint.format())
        .pipe(eslint.failOnError())
    })

    gulp.task('default', ['lint'], () => {

    })
    ```

    我们创建了 `lint` 任务, 在执行 `gulp` 时会被触发

    ![image](https://cloud.githubusercontent.com/assets/533360/9658228/79b6f6ac-527a-11e5-8c64-ef9498a4e318.png)

4. `package.json` - npm scripts 支持

    ```json
    "scripts": {
      "lint": "gulp lint"
    }
    ```

    也可以通过执行 `npm run lint` 触发

5. 如何保证所有团队成员提交的代码都是通过检查的

    > 最佳实践是在 `git commit` 时进行检查, 如果不通过拒绝提交(如果是 "1 warning" 不强制拒绝), 要完成这样的需求, 我们需要基于 git 配置 `pre-commit` hook, 基于 ESLint 执行检查, 为了将 `pre-commit` 抽离为项目配置, 在项目初始化时进行软链
    
    在项目根目录下创建 `.pre-commit`:

    > 当待提交的 cached 文件命中 `.js$` 时触发 `lint`

    ```sh
    #!/bin/sh
    if git diff --cached --name-only --diff-filter=ACM | grep '.js$' >/dev/null 2>&1
    then
        ./node_modules/.bin/gulp lint
    fi

    exit $?
    ```

    然后更改文件权限为可执行:

    ```sh
    $ chmod +x .pre-commit
    ```
    
    添加 `package.json` 的安装时的软链行为:

    ```json
    "scripts": {
      "postinstall": "ln -s .pre-commit .git/hooks/pre-commit"
    }
    ```

    这样任何团队成员在通过 `npm install` 完成项目初始化后, 都自动添加了 `git commit` 的检查 hook

    ![image](https://cloud.githubusercontent.com/assets/533360/9658260/b8b75fc2-527a-11e5-9599-0092f3b22b4b.png)

6. 编辑器支持(以 [Sublime Text 3](http://www.sublimetext.com/3) 为例, 对于其他编辑器 ESLint 都有广泛的插件支持)

    > 最佳实践是基于强大的 [SublimeLinter3](https://github.com/SublimeLinter/SublimeLinter3) 插件, 后续也可以一致性的进行 `html` 和 `css` 文件的检查

    通过 [Package Control](https://packagecontrol.io/installation) 安装 [SublimeLinter3](https://github.com/SublimeLinter/SublimeLinter3), [SublimeLinter-contrib-eslint](https://github.com/roadhump/SublimeLinter-eslint)

    配置 SublimeLinter, 注册 `javascript (babel)` 类型为 `javascript`:

    ```json
    "syntax_map": {
        "html (django)": "html",
        "html (rails)": "html",
        "html 5": "html",
        "javascript (babel)": "javascript",
        "php": "html",
        "python django": "python"
    }
    ```

    推荐启用 SublimeLinter 的 "show error on save", 这样在保存时能自动检查并快速定位到不规范的代码

    ![image](https://cloud.githubusercontent.com/assets/533360/9658353/484f8a6a-527b-11e5-8a6e-49d6b436779c.png)

    > 为了使编辑器更好的支持 ES2015 和 JSX 语法, 推荐安装 [Babel](https://github.com/babel/babel-sublime), 并且替换默认的 Javascript 语法包
    
    修改 "Settings - User":

    ```json
    "ignored_packages":
    [
        "JavaScript"
    ]
    ```

    > 推荐兼容 ES2015 和 JSX 的 color scheme [Oceanic Next Color Scheme](https://github.com/voronianski/oceanic-next-color-scheme)

    ![image](https://cloud.githubusercontent.com/assets/533360/9658412/af3f1d6c-527b-11e5-8950-8ac29edd1fcd.png)

7. 支持持续集成平台

    > 在团队成员提交代码或是提交代码合入申请时, 我们需要所有代码自动完成风格检查和测试任务以确保代码是可以被合入的, 推荐 [circle](https://circleci.com) 来替代 [travis](https://travis-ci.org/), 我们先基于 circle 来完成语法风格检查的配置

    首先在 https://circleci.com 关联项目, 然后在项目根目录创建 `.circle.yml`:

    ```yaml
    machine:
      node:
        version: 0.10.33
    ```

    > 这里简单指定了测试所需的 `node` 版本, 如果没有指定默认会用 `0.10.33` 的版本进行测试
    
    通常 node 项目的生态系统中, 默认都通过执行 `npm test` 来进行测试, 我们也为此配置相应脚本:

    ```json
    "scripts": {
      "test": "gulp test"
    }
    ```

    接着创建 `gulp` 的 `test` 任务:

    ```js
    gulp.task('test', (done) => {
        // do some test
    })
    ```

    `git push` 提交后 circle 平台会自动开始测试任务, 任务结束后以邮件通知结果

    

