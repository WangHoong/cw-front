var React = require('react');
var Loader = require('../Common/Loader.jsx');
var ImagePreloader = require('app/components/Common/ImagePreloader.jsx');

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
        <li className='text-center'>{window.lang.cnfrc}</li>
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
                <p className='ellipsis'>{item['name'] || window.lang.unknown}</p>
                <p className='ellipsis'>{item['country'] || window.lang.unknown}</p>
              </div>
              <div className='info row'>
                <div className='number first col-md-6 text-center'>
                  <p>{item['track_nums']}</p>
                  <p>{window.lang.ar_tracks}</p>
                </div>
                <div className='number col-md-6 text-center'>
                  <p>{item['album_nums']}</p>
                  <p>{window.lang.ar_albums}</p>
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
