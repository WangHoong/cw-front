import React, { Component } from 'react'
import List from 'app/components/SongTop100/List.jsx'
import Card from 'app/components/SongTop100/Card.jsx'

class Main extends Component {
  constructor(props) {
    super(props)
  }
  render() {
    return (
      <div>
        {List}
      </div>
    )
  }
}
export default Main
