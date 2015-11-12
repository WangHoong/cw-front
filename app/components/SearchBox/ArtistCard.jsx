'use strict';
var React = require('react');
var debug = require('debug')('topdmc:SearchBox/Component/ArtistCard');
var classNames = require('classnames');
var Role = require('../Common/Role.jsx');

var ArtistCard = React.createClass({

  propTypes: {
    rainbowColor: React.PropTypes.string.isRequired,
    data: React.PropTypes.object.isRequired
  },

  getDefaultProps: function(){
    return {
      rainbowColor: '#12bdc4',
      data:{
        id: '',
        name: '歌手名称',
        photo: 'images/default-album-card.jpg'
      }
    };
  },

  handleItemClick: function (event) {
    event.preventDefault();
    this.props.onItemClick({type: 'Artist', data: this.props.data});
  },

  handleDragStart: function(event) {
    event.dataTransfer.setData('data', JSON.stringify({type:'Artist',data:this.props.data}));
    debug(JSON.stringify(this.props));
  },

  render: function() {
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
            <p>{this.props.data.country}</p>
            {/* 为ADMIN显示ID */}
            <Role component='span' roleName='ADMIN' style={{position: 'absolute', fontSize: '16px', color: 'red', bottom: '-12px', left: '5px', zIndex: '10', fontWeight: 'bold'}}>{this.props.data.id}</Role>
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

module.exports = ArtistCard;
