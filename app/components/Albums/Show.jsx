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
          className='topdmc'
          handleToEdit={this.handleToEdit}
          id={this.context.router.getCurrentParams().id} />
      );
    }

    if (this.state.view === 'edit') {
      return (
        <Edit
          className='topdmc'
          handleToDetail={this.handleToDetail}
          id={this.context.router.getCurrentParams().id} />
      );
    }

    return (
      <p>error</p>
    );
  },

  render: function() {
    return this.renderChildren();
  }

});

module.exports = Show;
