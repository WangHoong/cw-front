
"use strict";
var React = require('react');
var Reflux = require('reflux');

var List = React.createClass({
  render: function(){
    var record = this.props.data;
    var imgurl ='../../../public/images/load-fail.jpg';
    if(record.album&&record.album.photo){
      imgurl=record.album.photo;
    }
    var name ='未知';
    if(record.artists[0]&&record.artists[0]['name']){
      name = record.artists[0]['name'];
    }
    // if(record.artist)
    //   record.artist.map(function(item,i){
    //     console.log(item.name);
    //   })
    // }

    return(

        <li className='store-cardlist col-sm-6'>
          <div className='store-card'>
            <div className='store-img'>
              <img src={imgurl}></img>
            </div>
            <p className='store-zt'><span className='store-sq'>已独家</span></p>
            <p className='store-name'>{record.name}</p>
            <p className='store-artist'><span>艺人：</span><span>{name}</span></p>
            <p className='store-record'><span>所属唱片公司：</span>索尼音乐</p>
            <p className='store-yy'><span>授权公司：</span>QQ音乐</p>
            <p className='store-record'><span>版权有效期：</span>2015.3~2020.3</p>
            <p className='store-dmc-pri'><span>dmc价：</span><span className='store-price'>￥520.56</span></p>
            <p className='store-add'>加入购物车</p>
          </div>
        </li>

    )
  }

});

module.exports = List;
