'use strict';

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
          onEditClick={this.handleEditClick}
          id={this.context.router.getCurrentParams().id} />
      );
    }

    if (this.state.status === 'edit') {
      return (
        <Edit
          onUpdated={this.handleUpdated}
          onCancelClick={this.handleUpdated}
          id={this.context.router.getCurrentParams().id} />
      );
    }

    return (
      <div/>
    )
  },
  render: function () {
    return this.renderBody();
  }

});

module.exports = List;
