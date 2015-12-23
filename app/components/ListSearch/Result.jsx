var React = require('react');
var Loader = require('../Common/Loader.jsx');
var classNames = require('classnames');

var Result = React.createClass({

  getDefaultProps: function() {
    return {
      data: {}
    };
  },

  componentDidMount: function() {
    if (this.props.type == 'Album') {
      this.type = window.lang.s_album;
    } else if (this.props.type == 'Song') {
      this.type = window.lang.s_track;
    }
  },

  handleItemClick: function(evt) {
    var id = evt.target.parentNode.getAttribute('data-id');
    var name = evt.target.parentNode.getAttribute('data-name');
    this.props.handleItemSearch(id, name);
    this.props.hideElement();
  },

  componentWillUnmount: function() {
    this.props.handleClear();
  },

  renderList: function() {
    var data = this.props.data;

    // 初始化提示
    if (data.state === 'DISABLED') {
      return (
        <p className='text-center'>{window.lang.kors}</p>
      );
    }

    // 正在查询
    if (data.state === 'SEARCHING') {
      return (
        <Loader />
      );
    }

    // 查询完毕, 无结果
    if (data.state === 'DONE' && data.results.length == 0) {
      return (
        <p className='text-center'>{window.lang.nsrpe}</p>
      );
    }

    // 查询完毕，有结果
    if (data.state === 'DONE' && data.results.length !== 0) {
      var items = data.results.map(function(item, idx) {
        return (
          <li key={idx}>
            <a
              data-id={item.id}
              data-name={item.name}
              onClick={this.handleItemClick}>{window.lang.s_view}<span className='name'>{item.name}</span>{window.lang.s_all}{this.type}</a>
          </li>
        );
      }.bind(this));
      return (
        <div className='tips-list'>
          <ul>{items}</ul>
        </div>
      );
    }

    // 其他错误
    return (
      <p className='text-center'>{window.lang.unknownError}</p>
    );
  },

  render: function() {
    var isShow = this.props.data.isShow;
    var className = classNames('t-sb-result', {
      'show': isShow
    });
    return (
      <div className={className} ref='result'>
        {this.renderList()}
      </div>
    );
  }

});

module.exports = Result;
