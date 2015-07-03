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
    var data = this.refs['editForm'].getValue();
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
      <Form ref='editForm' data={data}>
        <button
          className='btn btn-warning mr10'
          onClick={this.handleUpdate}>保存
        </button>
        <button
          className='btn btn-default'
          onClick={this.props.handleToDetail}>放弃
        </button>
      </Form>
    );
  }
});

module.exports = Edit;
