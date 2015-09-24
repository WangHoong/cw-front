import React from 'react';

class Item extends React.Component {
  constructor(props) {
    super(props);
    this.item = this.props.item;
  }

  renderHistory() {
    if (this.item.rank < this.item.last_week_rank) {
      return (
        <i className='fa fa-level-up'></i>
      );
    }
    if (this.item.rank > this.item.last_week_rank) {
      return (
        <i className='fa fa-level-down'></i>
      );
    }
    if (this.item.rank == this.item.last_week_rank) {
      return (
        <i className='fa fa-minus'></i>
      );
    }
  }

  renderThumb() {
    const imageStyle = {
      backgroundImage: 'url(' + this.item.album_photo +')'
    };
    return (
      <div className='image' style={imageStyle}></div>
    );
  }

  render() {
    return (
      <li className='col-sm-6 primary'>
        <div className='primary-inner'>
          <div className='history'>{this.renderHistory()}</div>
          <div className='rank'>
            <p className='this-week'>{this.item.rank}</p>
            <p className='last-week'>上周排名：{this.item.last_week_rank}</p>
          </div>
          {this.renderThumb()}
          <div className='title'>
            <h2 className='ellipsis'>{this.item.track_name}</h2>
            <h3 className='ellipsis'>{this.item.album_name}</h3>
          </div>
        </div>
      </li>
    );
  }
};

export default Item;
