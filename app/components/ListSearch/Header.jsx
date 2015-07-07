var React = require('react');
var Header = React.createClass({

  handleKeyUp: function(evt) {
    var value = evt.target.value;
    if (evt.keyCode === 13) {
      this.props.handleKeywordsSearch(value);
      this.refs.input.getDOMNode().value = '';
      this.props.hideElement();
      this.refs.input.getDOMNode().blur();
      return;
    }
    this.props.handleSearch(value);
  },

  setText:function(text){
    this.refs.input.getDOMNode().value = '';
    this.refs.input.getDOMNode().placeholder = text;
  },

  handleFocus: function() {
    this.props.showElement();
  },

  render: function() {
    return (
      <div className='t-sb-header'>
        <input
          ref='input'
          type='text'
          className='form-control'
          placeholder='搜索'
          onKeyUp={this.handleKeyUp}
          onFocus={this.handleFocus} />
        <i className='feed-icon fa fa-search'></i>
      </div>
    );
  }

});

module.exports = Header;
