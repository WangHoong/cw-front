var React = require('react');
var assign = require('object-assign');

var TextareaAutosize = React.createClass({

  componentDidMount: function () {
    this.recalculateSize();
  },

  componentDidUpdate: function (prevProps) {
    if (prevProps.style || prevProps.value !== this.props.value || this.props.value == null) {
      this.recalculateSize();
    }
  },

  onChange: function (evt) {
    if (this.props.onChange) {
      this.props.onChange(evt);
    }
    if (this.props.value === undefined) {
      this.recalculateSize();
    }
  },

  recalculateSize: function () {
    var diff;
    var node = this.getDOMNode();

    if (window.getComputedStyle) {
      var styles = window.getComputedStyle(node);
      if (styles.getPropertyValue('box-sizing') === 'border-box' || styles.getPropertyValue('-moz-box-sizing') === 'border-box' || styles.getPropertyValue('-webkit-box-sizing') === 'border-box') {
        diff = 0;
      } else {
        diff = (parseInt(styles.getPropertyValue('padding-bottom') || 0, 10) + parseInt(styles.getPropertyValue('padding-top') || 0, 10));
      }
    } else {
      diff = 0;
    }

    var node = this.getDOMNode();
    node.style.height = 'auto';
    node.style.height = (node.scrollHeight - diff) + 'px';
  },

  render: function() {
    return (
      <textarea
        {...this.props}
        onChange={this.onChange} />
    );
  }

});

module.exports = TextareaAutosize;
