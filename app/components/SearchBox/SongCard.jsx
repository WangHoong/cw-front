'use strict';
var React = require('react');
var debug = require('debug')('topdmc:SearchBox/Component/SongCard');
var classNames = require('classnames');

var SongCard = React.createClass({

  propTypes: {
    rainbowColor: React.PropTypes.string,
    onItemClick: React.PropTypes.func.isRequired,
    data: React.PropTypes.object.isRequired,
    disabled: React.PropTypes.bool
  },

  getDefaultProps: function () {
    return {
      rainbowColor: '#12bdc4',
      disabled: false,
      data: {
        name: '歌曲名称',
        artistName: '歌手名',
        id: '',
        photo: 'images/default-song-card.jpg'
      }
    };
  },

  handleItemClick: function (event) {
    event.preventDefault();
    this.props.onItemClick({type: 'Song', data: this.props.data});
  },

  handleDragStart: function (event) {
    event.dataTransfer.setData('data', JSON.stringify({type: 'Song', data: this.props.data}));
    debug(JSON.stringify(this.props));
  },

  render: function () {
    var data = this.props.data || {};
    var style = {
      backgroundImage: 'url(' + ((this.props.data.album||{}).photo) + ')'
    };
    var itemClassName = classNames('card-search', {
      'disabled': this.props.disabled
    });
    var iconClassName = this.props.disabled ? classNames('fa', 'fa-check') : classNames('fa', 'fa-plus');

    return (
      <li draggable="true" onDragStart={this.handleDragStart} className={itemClassName}>
        <div className='rainbow-bar' style={{backgroundColor: this.props.rainbowColor}}></div>
        <div className='info'>
          <div className='thumb' style={style}></div>
          <div className='txt'>
            <p>{data.name}</p>
          </div>
        </div>
        <a type='button' className='btn btn-success' onClick={this.handleItemClick}
           disabled={this.props.disabled}>
          <i className={iconClassName}></i>
        </a>
      </li>
    );
  }
});

module.exports = SongCard;
