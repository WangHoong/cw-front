'use strict';
var React = require('react');
var dbg = require('debug')('topdmc:SearchBox/Components/Result');
var SongCard = require('./SongCard.jsx');
var ArtistCard = require('./ArtistCard.jsx');
var AlbumCard = require('./AlbumCard.jsx');
var _ = require('lodash');

/*
 * SearchResult
 */
var Result = React.createClass({

  displayName: 'SearchBoxResult',

  propTypes: {
    onItemClick: React.PropTypes.func.isRequired
  },

  getInitialState: function () {
    return null;
  },

  getDefaultProps: function () {
    return {data: []};
  },

  hasSelected: function (item) {
    return _.findIndex(this.props.selectedItems, {id: item.id})!==-1;
  },

  renderList: function () {
    var results = this.props.data;
    if (this.props.state === 'DONE' && results.length === 0) {
      return (
        <li className='no-result'>{window.lang.noresults}</li>
      );
    }

    var type = this.props.type;
    var items = [];

    // 歌曲
    if (type === 'Song') {
      for (var key in results) {
        var item = results[key];
        var disabled = this.hasSelected(item);
        items.push(<SongCard key={key} data={item} disabled={disabled} onItemClick={this.props.onItemClick}/>);
      }
      return items;
    }

    // 歌曲
    if (type === 'Album') {
      for (var key in results) {
        var item = results[key];
        var disabled = this.hasSelected(item);
        items.push(<AlbumCard key={key} data={item} disabled={disabled} onItemClick={this.props.onItemClick}/>);
      }
      return items;
    }

    // 歌曲
    if (type === 'Artist') {
      for (var key in results) {
        var item = results[key];
        var disabled = this.hasSelected(item);
        items.push(<ArtistCard key={key} data={item} disabled={disabled} onItemClick={this.props.onItemClick}/>);
      }
      return items;
    }


    items.push(<p className='text-center'>参数错误</p>);
    return items;
  },

  render: function () {
    return (
        <ul className="search-box-results">{this.renderList()}</ul>
    );
  }
});

exports = module.exports = Result;
