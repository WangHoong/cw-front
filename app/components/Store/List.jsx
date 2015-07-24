
"use strict";
var React = require('react');
var Reflux = require('reflux');

var List = React.createClass({
  contextTypes: {
    router: React.PropTypes.func
  },
  onClick: function(e){
    var id = e.target.getAttribute('data-id');
    console.log(id);
    this.context.router.transitionTo('show_edit_song', {id: id}, {});
  },
  render: function(){
    var record = this.props.data;
    var imgurl ='../images/load-fail.jpg';
    if(record.album&&record.album.photo){
      imgurl=record.album.photo;
    }
    var name ='未知';
    if(record.artists[0]&&record.artists[0]['name']){
      name = record.artists[0]['name'];
    }
    var lyricist = '未知';
    if(record.lyricist){
      lyricist = record.lyricist;
    }
    var composer = '未知' ;
    if(record.composer){
      composer = record.composer;
    }
    var state = '';
    if(record.copyRight.is_exclusive){
      state='已独家';
    }
    var client = '暂无';
    if(record.copyRight.client){
     client = record.copyRight.client['name'];
    }

    return(

        <li className='store-cardlist col-sm-6'>
          <div className='store-card'>
            <div className='store-img' >
              <a onClick={this.onClick} ><img src={imgurl} data-id={record.id}></img></a>
            </div>
            <p className='store-zt'><span className='store-sq'>{state}</span></p>
            <p className='store-name'>{record.name}</p>
            <p className='store-artist'><span>艺人：</span><span>{name}</span></p>
            <p className='store-yy'><span>作曲：</span>{composer}</p>
            <p className='store-yy'><span>作词：</span>{lyricist}</p>
            <p className='store-record'><span>所属唱片公司：</span>{record.copyRight.company['name']}</p>
            <p className='store-yy'><span>授权公司：</span>{client}</p>
            <p className='store-record'><span>版权有效期：</span>2015.3~2020.3</p>
            <p className='store-dmc-pri'><span>dmc价：</span><span className='store-price'>￥520.56</span></p>
            <p className='store-add'>加入购物车</p>
          </div>
        </li>

    )
  }

});

module.exports = List;
