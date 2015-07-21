var React = require('react');
var Reflux = require('reflux');
var List = require('./List.jsx');
var ListSearch = require('./Search.jsx');
var Pager = require('../common/Pager.jsx');
var Main = React.createClass({

  render: function() {
    return (

      <div>
        <ListSearch handleSearch={this.handleSearch} placeholder='歌手/专辑/歌曲' ref='searchBar'/>
        <List />

      </div>
      );
  }

});

module.exports = Main;
