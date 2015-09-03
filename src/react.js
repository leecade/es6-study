import React from 'react'

var Hello = React.createClass({
  displayName: 'Hello',
  render: function () {
    return (
      <div>
        Hello {this.props.name}
      </div>
    )
  }
})
