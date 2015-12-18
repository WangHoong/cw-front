// var React = require('react');
var React = require('react');
var _ = require('lodash');
var Loader = require('../Common/Loader.jsx');
var ImagePreloader = require('app/components/Common/ImagePreloader.jsx');

var List = React.createClass({

  propTypes: {
    onShowDetailAction: React.PropTypes.func
  },

  handleError: function(evt) {
    evt.target.src = 'http://placehold.it/188&text=null'
  },

  renderItems: function() {
    if (!this.props.loaded) {
      return (
        <li>
          <Loader />
        </li>
      );
    }
    if (this.props.items <= 0) {
      return (
        <li className='text-center'>{window.lang.cnfrc}</li>
      );
    } else {
      return this.props.items.map(function(item, idx) {
        return (
          <li key={idx} className='col-sm-2'>
            <div className='album'>
              <div className='thumb'>
                <ImagePreloader
                  onClick={this.props.onShowDetailAction}
                  data-id={item['id']}
                  src={item['photo']} />
              </div>
              <p className='name'>{item['name']}</p>
              <div className='info row'>
                <p className='col-md-8 ellipsis'>{_.collect(item.artists,'name').join(',')}</p>
                <p className='col-md-4 ellipsis text-right'>{item['track_nums']}{window.lang.ar_0}</p>
              </div>

            </div>
          </li>
        );
      }.bind(this));
    }
  },

  render: function() {
    return (
      <ul className='album-list row'>
        {this.renderItems()}
      </ul>
    );
  }

});

module.exports = List;
