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

  removeHtml: (str) => {
    const r = /\\n|\&amp/g
    return str.replace(r, '')
  },

  cutString: (str, n) => {
    const r = /[^\x00-\xff]/g
    if (str.replace(r, 'mm').length <= n) {
      return str
    }
    const m = Math.floor(n / 2)
    for (let i = m; i < str.length; i++) {
      if (str.substr(0, i).replace(r, 'mm').length >= n) {
        return `${str.substr(0, i)}...`
      }
    }
    return str
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
                <h3 className='ellipsis itemName'>
                  {item['name'] || window.lang.unknown}
                  <span className='gender'>
                    {item['gender'] &&
                      item['gender'] === 1 && <i className='fa fa-mars genderMen' aria-hidden='true'></i> ||
                      item['gender'] === 2 && <i className='fa fa-venus genderWoman' aria-hidden='true'></i>}
                  </span>
                </h3>
                <p className='ellipsis'>{item['country'] || window.lang.unknown}</p>
              </div>
              <div className='detailText'>
                <p>{item['desc'] && this.removeHtml(item['desc']) || '暂无简介'}</p>
              </div>
              <div className='info'>
                <div className='number first col-md-6 text-center'>
                  <p className='info-number'>{item['track_nums']}</p>
                  <p className='info-text'>{window.lang.ar_tracks}</p>
                </div>
                <div className='number col-md-6 text-center'>
                  <p className='info-number'>{item['album_nums']}</p>
                  <p className='info-text'>{window.lang.ar_albums}</p>
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
