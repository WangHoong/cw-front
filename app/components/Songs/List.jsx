var React = require('react');
var Loader = require('../Common/Loader.jsx');
var _ = require('lodash');
var bytes = require('bytes');

var ImagePreloader = require('app/components/Common/ImagePreloader.jsx');

var SongList = React.createClass({

  renderTableHeader: function () {
    return (
      <thead>
        <tr>
          <th>{window.lang.tr_cover}</th>
          <th>{window.lang.tr_track}</th>
          <th>{window.lang.tr_artist}</th>
          <th>{window.lang.tr_album}</th>
          <th>{window.lang.tr_sq}</th>
          <th>{window.lang.tr_hq}</th>
          <th>{window.lang.tr_ly}</th>
          <th>{window.lang.tr_co}</th>
          <th>{window.lang.tr_MV}</th>
          <th>{window.lang.tr_op}</th>
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
          <td align='center' colSpan='10' className='text-center'>{window.lang.cnfrc}</td>
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

        var has128 = item.play_url_128 != null ? <i className='fa fa-2x fa-check check' /> : <i className='fa fa-2x fa-ban nocheck' />;
        var has320 = item.play_url_320 != null ? <i className='fa fa-2x fa-check check' /> : <i className='fa fa-2x fa-ban nocheck' />;

        return (
          <tr key={item.id}>
            <td><ImagePreloader className='img-circle' src={(item.album || {}).photo} /></td>
            <td>{item.name}</td>
            <td>{_.map(item.artists, 'name').join(',')}</td>
            <td>{(item.album || {}).name}</td>
            <td>{has128}</td>
            <td>{has320}</td>
            <td>{item.lyricist}</td>
            <td>{item.composer}</td>
            <td>{hasMV}</td>
            <td>
              <a className='btn-link' data-id={item.id} onClick={this.props.onShowDetailAction}>{window.lang.tr_view}</a>
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
