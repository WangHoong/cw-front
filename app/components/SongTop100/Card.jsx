import React, { Component } from 'react'

class Card extends Component {
  constructor(props) {
    super(props)
  }

  render() {
    return (
      <article className="chart-row" data-hovertracklabel="Song Hover-Can't Feel My Face">
        <div className="row-primary">
          <div className="row-history row-history-rising"></div>
          <div className="row-award-indicator">
            <i className="fa fa-star"></i>
          </div>
          <div className="row-bullet">
            <i className="fa fa-dot-circle-o"></i>
          </div>
          <div className="row-rank">
            <span className="this-week">{this.props.thisWeek}</span>
            <span className="last-week">Last Week: {this.props.lastWeek}</span>
          </div>
          <div className="row-image"
               style={{backgroundImage: 'url('+ this.props.artistAvator +')'}}>
          </div>
          <div className="row-title">
            <h2>{this.props.songName}</h2>
            <h3>
              <a href="http://www.billboard.com/artist/419413/weeknd" data-tracklabel="Artist Name">{this.props.artistName}</a>
            </h3>
          </div>
        </div>
        <div id="row-1-secondary" className="row-secondary">
          <div className="stats">
            <div className="stats-last-week">
              <span className="label">Last Week</span>
              <span className="value">{this.props.lastWeek}</span>
            </div>
            <div className="stats-top-spot">
              <span className="label">Peak Position</span>
              <span className="value">{this.props.peakPosition}</span>
            </div>
            <div className="stats-weeks-on-chart">
              <span className="label">Wks on Chart</span>
              <span className="value">{this.props.wksOnChart}</span>
            </div>
          </div>
          <ul className="fa-ul row-awards">
            <li>
              <i className="fa fa-li fa-signal"></i>
               {this.props.bGInX}
            </li>
            <li>
              <i className="fa fa-li fa-dot-circle-o"></i>
               Gains in performance
            </li>
          </ul>
        </div>
      </article>
    )
  }
}

export default Card
