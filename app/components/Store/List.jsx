
"use strict";
var React = require('react');
var Reflux = require('reflux');

var List = React.createClass({
  contextTypes: {
    router: React.PropTypes.func
  },
  onClick: function(e){
    var id = e.target.getAttribute('data-id');
    this.context.router.transitionTo('show_edit_song', {id: id}, {});
  },
  render: function(){
    var record = this.props.data;
    return(
      <li className='store-cardlist col-sm-6'>
        <div className='store-card'>
          <div className='store-img' >
            <a onClick={this.onClick} >
              <img src={record.album && record.album.photo || '../images/load-fail.jpg'} data-id={record.id} />
            </a>
          </div>
          <p className='store-zt'>
            <span className='store-sq'>{record.copyRight.is_exclusive && '已独家'}</span>
          </p>
          <p className='store-name'>{record.name}</p>
          <p className='store-artist'>
            <span>艺人：</span><span>{record.artists[0] && record.artists[0]['name'] || window.lang.unknown}</span>
          </p>
          <p className='store-yy'>
            <span>作曲：</span>{record.composer || window.lang.unknown}；<span>作词：</span>{record.lyricist || window.lang.unknown}
          </p>
          <p className='store-record'><span>所属唱片公司：</span>{record.copyRight.company['name']}</p>
          <p className='store-yy'>
            <span>授权公司：</span>{record.copyRight.client && record.copyRight.client['name'] || '暂无'}
          </p>
          <p className='store-yy'>
            <span>授权截止时间：</span>{record.copyRight.client_expired && moment(record.copyRight.client_expired).format('YYYY年MM月DD日') || '暂无'}
          </p>
          <p className='store-record'>
            <span>版权有效期：</span>{record.copyRight.started && moment(record.copyRight.started).format('YYYY年MM月DD日')}~{record.copyRight.expired && moment(record.copyRight.expired).format('YYYY年MM月DD日')}
          </p>
          <p className='store-dmc-pri'><span>dmc价：</span><span className='store-price'>￥520.56</span></p>
          <p className='store-add'>加入购物车</p>
        </div>
      </li>
    )
  }

});

module.exports = List;
