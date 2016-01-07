var React = require('react');
var Header = React.createClass({

  handleKeyUp: function(evt) {
    var value = evt.target.value;
    if (evt.keyCode === 13) {
      this.props.handleKeywordsSearch(value);
      this._input.value = '';
      this.props.hideElement();
      this._input.blur();
      return;
    }
    this.props.handleSearch(value);
  },

  setText:function(text){
    this._input.value = '';
    this._input.placeholder = text;
  },

  handleFocus: function() {
    this.props.showElement();
  },

  render: function() {
    return (
      <div className='t-sb-header'>
        <input
          ref={ _ => this._input = _ }
          type='text'
          className='form-control'
          placeholder={window.lang.search}
          onKeyUp={this.handleKeyUp}
          onFocus={this.handleFocus} />
        <i className='feed-icon fa fa-search'></i>
      </div>
    );
  }

});

module.exports = Header;
