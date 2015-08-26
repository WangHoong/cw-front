import React, { Component } from 'react'
import Card from 'app/components/SongTop100/Card.jsx'

class List extends Component {
  constructor(props) {
    super(props)
  }

  render() {
    const songTop100 = this.props.songTop100

    let cards = songTop100.map( (item, i) =>
      <Card key={i} {...item} />
    )

    return (
      <div className="container">
        {cards}
      </div>
    )
  }
}

export default List
