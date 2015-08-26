import React, { Component } from 'react'
import List from 'app/components/SongTop100/List.jsx'
import Card from 'app/components/SongTop100/Card.jsx'

class Main extends Component {
  constructor(props) {
    super(props)
  }
  render() {
    let songTop100 = [
      {
        thisWeek: 1,
        lastWeek: 2,
        peakPosition: 1,
        wksOnChart: 9,
        bGInX: 'Biggest gain in streams',
        songName: 'Can\'t Feel My Face',
        artistAvator: 'http://www.billboard.com/images/pref_images/q25361d2jtk.jpg',
        artistName: 'The Weeknd',
      }
    ]
    return (
      <List songTop100={songTop100} />
    )
  }
}
export default Main
