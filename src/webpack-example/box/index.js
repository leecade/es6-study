import styles from './index.css'

// var img = document.createElement('img');
// img.src = require('./glyph.png');

import avatar from './avatar.png'

export default (text) => {
  return `
  <div class=${styles.box}>
    <div class=${styles.avatar}>
      <img width="64" src=${avatar}>
    </div>
    <div class=${styles.name}>
      ${text}
    </div>
  `
}
