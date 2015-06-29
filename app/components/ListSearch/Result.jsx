var Loader = require('../Common/Loader.jsx');
var classNames = require('classnames');
var debug = require('debug')('topdmc:ListSearch/Result');

var Result = React.createClass({

  getDefaultProps: function() {
    return {
      data: {}
    };
  },

  componentDidMount: function() {
    if (this.props.type == 'Album') {
      this.type = '专辑';
    } else if (this.props.type == 'Song') {
      this.type = '歌曲';
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
    debug(data);

    // 初始化提示
    if (data.state === 'DISABLED') {
      return (
        <p className='text-center'>输入关键词根据艺人查询，或按回车模糊查询</p>
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
        <p className='text-center'>未搜索到相关内容，按回车进行模糊查询</p>
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
              onClick={this.handleItemClick}>查看<span className='name'>{item.name}</span>的所有{this.type}</a>
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
      <p className='text-center'>未知错误</p>
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
