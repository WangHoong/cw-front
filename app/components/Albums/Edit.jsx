'use strict';
var React = require('react');
var Reflux = require('reflux');
var AlbumStore = require('../../stores/AlbumStore');
var AlbumActions = require('../../actions/AlbumActions');
var Form = require('./Form.jsx');

var Edit = React.createClass({

  mixins: [Reflux.connect(AlbumStore, 'album')],

  componentDidMount: function () {
    AlbumActions.get(this.props.id);
  },

  handleUpdate: function () {
    var data = this._editForm.getValue()
    AlbumActions.update(this.props.id, data);
  },

  componentWillUpdate: function (nextProps, nextState) {
    if (nextState.album.updated === true) {
      this.props.handleToDetail();
    }
  },

  render: function () {
    var data = this.state.album.data;
    return (
      <Form ref={ _ => this._editForm = _ } data={data}>
        <button
          className='btn btn-warning mr10'
          onClick={this.handleUpdate}>{window.lang.save}
        </button>
        <button
          className='btn btn-default'
          onClick={this.props.handleToDetail}>{window.lang.cancel}
        </button>
      </Form>
    );
  }
});

module.exports = Edit;
