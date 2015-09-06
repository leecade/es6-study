import './common/index.css'
import styles from './index.css'
import box from './box/index'

let boxContent = box('leecade')

let wrap = `
  <h1>webpack example</h1>
  <div class=${styles.wrap}>${boxContent}</div>
`

document.body.innerHTML = wrap
