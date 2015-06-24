'use strict';
var SearchBoxMain = require('app/components/searchBox/Main.jsx');

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
