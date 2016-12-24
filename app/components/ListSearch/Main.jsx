var React = require('react');
var Reflux = require('reflux');
var Header = require('./Header.jsx');
var Result = require('./Result.jsx');

var ListSearchActions = require('../../actions/ListSearchActions');
var ListSearchStore = require('../../stores/ListSearchStore');

var Main = React.createClass({

  mixins: [Reflux.connect(ListSearchStore, 'data')],

  getDefaultProps: function() {
    return {
      type: 'Album'
    };
  },

  // 显示result
  showElement: function() {
    ListSearchActions.toggledShow(true);
  },

  // 隐藏result
  hideElement: function() {
    ListSearchActions.toggledShow(false);
  },

  // 清除数据
  handleClear: function() {
    ListSearchActions.clear();
  },

  // 组件挂载后声明timer，绑定document点击事件
  componentDidMount: function() {
    this.timer = null;
    document.addEventListener('click', this.hideElement, false);
  },

  // 组件销毁后清除timer，取消绑定document点击事件
  componentWillUnmount: function() {
    clearTimeout(this.timer);
    document.removeEventListener('click', this.hideElement, false);
  },

  handleItemSearch:function(id, name){
    var name = this.props.placeholderPattern.replace(/\$\{name\}/g, name);
    this.refs.header.setText(name);
    this.props.handleItemSearch && this.props.handleItemSearch.call({}, id, name);
  },

  // 延迟搜索
  handleSearch: function(keywords) {
    if (keywords.replace(/(^\s*)|(\s*$)/g, '').length == 0) return;
    clearTimeout(this.timer);
    this.timer = setTimeout(function() {
      var params = {
        q: keywords,
        size: 5,
        types: 'artist'
      };
      ListSearchActions.search(params);
    }.bind(this), 500);
  },

  // 阻止冒泡
  stopPropagation: function(evt) {
    evt.nativeEvent.stopImmediatePropagation();
  },

  render: function() {
    return (
      <div className='t-sb topdmc' onClick={this.stopPropagation}>
        <Header
          ref='header'
          handleSearch={this.handleSearch}
          handleKeywordsSearch={this.props.handleKeywordsSearch}
          showElement={this.showElement}
          hideElement={this.hideElement} />
        <Result
          type={this.props.type}
          data={this.state.data}
          handleItemSearch={this.handleItemSearch}
          showElement={this.showElement}
          hideElement={this.hideElement}
          handleClear={this.handleClear} />
      </div>
    );
  }

});

module.exports = Main;
