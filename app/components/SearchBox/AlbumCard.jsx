'use strict';
var React = require('react');
var debug = require('debug')('topdmc:SearchBox/Component/AlbumCard');
var classNames = require('classnames');

var AlbumCard = React.createClass({

  propTypes: {
    id: React.PropTypes.string.isRequired,
    rainbowColor: React.PropTypes.string.isRequired,
    data: React.PropTypes.object.isRequired
  },

  getDefaultProps: function () {
    return {
      rainbowColor: '#12bdc4',
      data: {
        id: '',
        name: '专辑名称',
        artistName: '歌手名',
        date: '发行日期',
        photo: 'images/default-album-card.jpg'
      }
    };
  },

  handleDragStart: function (event) {
    event.dataTransfer.setData('data', JSON.stringify({type: 'Album', data: this.props.data}));
    debug(JSON.stringify(this.props));
  },

  handleItemClick: function (event) {
    event.preventDefault();
    this.props.onItemClick({type: 'Album', data: this.props.data});
  },

  render: function () {
    var style = {
      backgroundImage: 'url(' + this.props.data.photo + ')'
    };
    var itemClassName = classNames('card-search', {
      'disabled': this.props.disabled
    });
    var iconClassName = this.props.disabled ? classNames('fa', 'fa-check') : classNames('fa', 'fa-plus');
    return (
        <li
          draggable='true'
          onDragStart={this.handleDragStart}
          className={itemClassName}>
          <div className='rainbow-bar' style={{backgroundColor: this.props.rainbowColor}}></div>
          <div className='info'>
            <div className='thumb' style={style}></div>
            <div className='txt'>
              <p>{this.props.data.name}</p>
            </div>
          </div>
          <a type='button' className='btn btn-success' onClick={this.handleItemClick}
             disabled={this.props.disabled}>
            <i className={iconClassName}></i></a>
        </li>
    );
  }
});

module.exports = AlbumCard;
