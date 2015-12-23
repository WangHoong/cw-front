import React from 'react';

class Item extends React.Component {
  constructor(props) {
    super(props);
    this.item = this.props.item;
  }

  renderHistory() {
    if (this.item.rank < this.item.last_week_rank) {
      return (
        <div className='history'>
          <span className='fa fa-level-up'></span>
          <span className='trend up'></span>
        </div>
      );
    }
    if (this.item.rank > this.item.last_week_rank) {
      return (
        <div className='history'>
          <span className='fa fa-level-down'></span>
          <span className='trend down'></span>
        </div>
      );
    }
    if (this.item.rank == this.item.last_week_rank) {
      return (
        <div className='history'>
          <span className='fa fa-minus'></span>
          <span className='trend minus'></span>
        </div>
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

  renderThend() {
    return (
      <div className='all-thend'>
        <div className='prev-week'>
          <p className='thend-title'>{window.lang.sp_lw_lw}</p>
          <p className='number'>{this.item.last_week_rank}</p>
        </div>
        <div className='peak'>
          <p className='thend-title'>{window.lang.sp_lw_pp}</p>
          <p className='number'>{this.item.peak_position}</p>
        </div>
        <div className='all-week'>
          <p className='thend-title'>{window.lang.sp_lw_woc}</p>
          <p className='number'>{this.item.wks_on_chart}</p>
        </div>
      </div>
    );
  }

  render() {
    return (
      <li className='col-sm-6 primary'>
        <div className='primary-inner'>
          {this.renderHistory()}
          <div className='rank'>
            <p className='this-week'>{this.item.rank}</p>
            <p className='last-week'>{window.lang.sp_lw}{this.item.last_week_rank}</p>
          </div>
          {this.renderThumb()}
          <div className='title'>
            <h2 className='ellipsis'>{this.item.track_name}</h2>
            <h3 className='ellipsis'>{this.item.album_name}</h3>
          </div>
          {this.renderThend()}
        </div>
      </li>
    );
  }
};

export default Item;
