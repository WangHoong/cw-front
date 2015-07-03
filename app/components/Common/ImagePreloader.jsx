var React = require('react');
var ImagePreloader = React.createClass({

  getInitialState: function() {
    return {
      loaded: false,
      fail: false
    };
  },

  getDefaultProps: function() {
    return {
      placehold: 'images/loading.gif'
    };
  },

  loader: function() {
    var image = new Image();
    image.src = this.props.src;

    image.onload = this.handleLoad;
    image.onabort = this.handleError;
    image.onerror = this.handleError;
  },

  componentDidMount: function() {
    this.loader();
  },

  handleLoad: function() {
    this.setState({
      loaded: true
    });
  },

  handleError: function() {
    this.setState({
      fail: true
    });
  },

  render: function() {
    var _src;
    if (this.state.loaded) {
      _src = this.props.src;
    } else if (this.state.fail) {
      _src = 'images/load-fail.jpg';
    } else {
      _src = this.props.placehold;
    }
    return (
      <img
        {...this.props}
        src={_src} />
    );
  }

});

module.exports = ImagePreloader;
