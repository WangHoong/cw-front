var React = require('react');
var Loader = require('../Common/Loader.jsx');

var ImagePreloader = require('app/components/Common/ImagePreloader.jsx');

var SongList = React.createClass({

  renderTableHeader: function () {
    return (
      <thead>
        <tr>
          <th>封面</th>
          <th>歌曲名称</th>
          <th>所属艺人</th>
          <th>所属专辑</th>
          <th>标准品质</th>
          <th>高品质</th>
          <th>作词</th>
          <th>作曲</th>
          <th>MV</th>
          <th>操作</th>
        </tr>
      </thead>
    );
  },

  renderItems: function () {

    if (!this.props.loaded) {
      return (
        <tr>
          <td align='center' colSpan='10'>
            <Loader/>
          </td>
        </tr>
      );
    }

    if (this.props.items.length <= 0) {
      return (
        <tr>
          <td align='center' colSpan='10' className='text-center'>未搜索到相关内容</td>
        </tr>
      );
    } else {
      var trs = this.props.items.map(function (item) {
        var hasMV = '';
        if (typeof item.mv_id !== "undefined" && item.mv_id > 0) {
          hasMV = <i className='fa fa-2x fa-check check'/>;
        } else {
          hasMV = <i className='fa fa-2x fa-ban nocheck'/>;
        }

        return (
          <tr key={item.id}>
            <td><ImagePreloader className='img-circle' src={(item.album || {}).photo} /></td>
            <td>{item.name}</td>
            <td>{_.map(item.artists, 'name').join(',')}</td>
            <td>{(item.album || {}).name}</td>
            <td>{item.size_128}</td>
            <td>{item.size_320}</td>
            <td>{item.composer}</td>
            <td>{item.lyricist}</td>
            <td>{hasMV}</td>
            <td>
              <a className='btn btn-link' data-id={item.id} onClick={this.props.onShowDetailAction}>查看</a>
            </td>
          </tr>
        );
      }.bind(this));
      return (
        <tbody>{trs}</tbody>
      );
    }
  },

  render: function () {
    var tableInstance = (
      <table className='table table-bordered table-striped'>
        {this.renderTableHeader()}
        {this.renderItems()}
      </table>
    );
    return (
      <div className='song-list'>{tableInstance}</div>
    );
  }

});

module.exports = SongList;
