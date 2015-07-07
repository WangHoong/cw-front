'use strict';
var React = require('react');
var SearchBoxMain = require('app/components/SearchBox/Main.jsx');

var Assist = React.createClass({
  render: function(){
    return (
      <div className='assist-box'>
        <SearchBoxMain type='Song' {...this.props} />
      </div>
    );
  }
});

module.exports = Assist;
