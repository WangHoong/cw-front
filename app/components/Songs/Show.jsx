'use strict';
var React = require('react');
var Detail = require('./Detail.jsx');
var Edit = require('./Edit.jsx');

var List = React.createClass({

  contextTypes: {
    router: React.PropTypes.func
  },

  getInitialState: function () {
    return {
      status: 'detail'
    }
  },

  handleUpdated: function () {
    this.state.status = 'detail';
    this.setState(this.state);
  },

  handleEditClick: function () {
    this.state.status = 'edit';
    this.setState(this.state);
  },

  renderBody: function () {
    if (this.state.status === 'detail') {
      return (
        <Detail
          className='topdmc'
          onEditClick={this.handleEditClick}
          id={this.context.router.getCurrentParams().id} />
      );
    }

    if (this.state.status === 'edit') {
      return (
        <Edit
          className='topdmc'
          onUpdated={this.handleUpdated}
          onCancelClick={this.handleUpdated}
          id={this.context.router.getCurrentParams().id} />
      );
    }

    return (<div/>)
  },

  handleBack: function () {
    history.go(-1)
  },
  render: function () {
    return this.renderBody();
  }

});

module.exports = List;
