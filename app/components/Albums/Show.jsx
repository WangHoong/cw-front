'use strict';
var React = require('react');
var Detail = require('./Detail.jsx');
var Edit = require('./Edit.jsx');

var Show = React.createClass({

  contextTypes: {
    router: React.PropTypes.func
  },

  getInitialState: function() {
    return {
      view: 'detail'
    };
  },

  handleToDetail: function() {
    this.setState({
      view: 'detail'
    });
  },

  handleToEdit: function() {
    this.setState({
      view: 'edit'
    });
  },

  renderChildren: function() {
    if (this.state.view === 'detail') {
      return (
        <Detail
          handleToEdit={this.handleToEdit}
          id={this.props.params.id} />
      );
    }

    if (this.state.view === 'edit') {
      return (
        <Edit
          handleToDetail={this.handleToDetail}
          id={this.props.params.id} />
      );
    }

    return (
      <p>error</p>
    );
  },

  render: function() {
    console.log('-----------',this)
    return this.renderChildren();
  }

});

module.exports = Show;
