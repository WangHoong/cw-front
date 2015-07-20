var React = require('react');
var ListSearch = require('../Common/ListSearch.jsx');
var Pager = require('../Common/Pager.jsx');

var Main = React.createClass({

  render: function() {
    return (
      <div className='list-wrap'>
        <ListSearch
          ref='searchBar'
          placeholder='搜索歌曲'
          handleSearch={this.handleSearch} />
        <div className='has-top-bar'>
          <Pager
            current='0'
            total='0'
            visiblePages='0'
            titles={{
              first: '第一页',
              prev: '上一页',
              prevSet: '...',
              nextSet: '...',
              next: '下一页',
              last: '最后一页'
            }}
            onPageChanged={this.handlePageChanged}/>
        </div>
      </div>
    );
  }

});

module.exports = Main;
