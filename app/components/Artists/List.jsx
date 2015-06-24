// var React = require('react');
// var Table = require('react-bootstrap').Table;

var Loader = require('../common/Loader.jsx');
var ImagePreloader = require('app/components/common/ImagePreloader.jsx');

var ArtistList = React.createClass({
  propTypes: {
    onShowDetailAction: React.PropTypes.func
  },

  handleError: function (evt) {
    evt.target.src = 'http://placehold.it/188&text=null'
  },

  renderItems: function () {
    if (!this.props.loaded) {
      return (
        <li className='col-sm-12'>
          <Loader />
        </li>
      );
    }
    if (this.props.items <= 0) {
      return (
        <li className='text-center'>未搜索到相关内容</li>
      );
    } else {
      return this.props.items.map(function (item, idx) {
        return (
          <li className='col-sm-2' key={idx}>
            <div className='artist'>
              <div className='thumb'>
                <ImagePreloader data-id={item['id']} onClick={this.props.onShowDetailAction} src={item['photo']}/>
              </div>
              <div className='name text-center'>
                <p className='ellipsis'>{item['name'] || '未知'}</p>
                <p className='ellipsis'>{item['country'] || '未知'}</p>
              </div>
              <div className='info row'>
                <div className='number first col-md-6 text-center'>
                  <p>{item['track_nums']}</p>
                  <p>歌曲数</p>
                </div>
                <div className='number col-md-6 text-center'>
                  <p>{item['album_nums']}</p>
                  <p>专辑数</p>
                </div>
              </div>
            </div>
          </li>
        );
      }.bind(this));
    }
  },

  render: function () {

    return (
      <ul className='artist-list row'>
        {this.renderItems()}
      </ul>
    );
  }

});

module.exports = ArtistList;
