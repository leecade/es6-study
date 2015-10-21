# bind this in ES2005

React 通过 `autobind` 来默默处理 `this` 的自动绑定

> https://facebook.github.io/react/blog/2013/07/02/react-v0-4-autobind-by-default.html
> http://facebook.github.io/react/blog/2015/01/27/react-v0.13.0-beta-1.html#autobinding

而在 ES2005 的 block 中, `this` 指向不会在 `render` 中切换, 所以会报错

```jsx
export default class button extends React.Component {
  constructor (props) {
    super(props)
  }
  clickHandle () {

  }
  render () {
    return <div>
    <button onClick={this.clickHandle}></button>
    </div>    
  }
}
```

解决方法:

- 使用时通过 `Function.prototype.bind()` 绑定

```jsx
<button onClick={this.clickHandle.bind(this)}></button>
```

- 在 `constructor` 中将方法指向改为绑定后的

```jsx
constructor(props) {
  super(props)
  this.clickHandle = this.clickHandle.bind(this)
}
```

- 使用 arrow function 方式绑定

```jsx
constructor(props) {
  super(props)
  this.clickHandle = () => this.clickHandle()
}
```

- 使用 ES7 class 特性

```jsx
export default class button extends React.Component {
  clickHandle = () => this.clickHandle()
}
```

> 推荐这种方式, [官方推荐](https://facebook.github.io/react/blog/2015/01/27/react-v0.13.0-beta-1.html#autobinding)的做法, 包含在 Babel 的 [Stage 0](https://babeljs.io/docs/usage/experimental/) 特性 [es7.classProperties](https://github.com/jeffmo/es-class-properties) 中

- 使用 ES7 的 bind 语法

```jsx
<button onClick={::this.clickHandle}></button>
```

> 但这种方式组件在每次渲染时都会重新创建 function 增加性能开销

- 使用 `autobind-decorator`

```jsx
import autobind from 'autobind-decorator'
export default class button extends React.Component {
  constructor (props) {
    super(props)
  }
  @autobind
  clickHandle () {

  }
  render () {
    return <div>
    <button onClick={this.clickHandle}></button>
    </div>    
  }
}
```

> https://github.com/andreypopp/autobind-decorator
