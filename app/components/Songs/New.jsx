var React = require('react');
var Reflux = require('reflux');
var SongStore = require('../../stores/SongStore');
var SongActions = require('../../actions/SongActions');
var Form = require('./Form.jsx');

/**
 * 新建歌手
 */
var New = React.createClass({

  mixins: [Reflux.connect(SongStore, 'song')],

  propTypes: {
    onCreated: React.PropTypes.func, // 创建完成后的事件
    onCanceled: React.PropTypes.func.isRequired // 取消创建的事件
  },

  /**
   * 创建成功后进行事件的通知
   * @param nextProps
   * @param nextState
   */
  componentWillUpdate: function (nextProps, nextState) {
    if (nextState.song.created === true) {
      this.props.onCreated && this.props.onCreated(nextState);
      history.back(-1);
    }
  },

  /**
   * 保存处理
   * @param e
   */
  handleSubmit: function () {
    var data = this._form.getValue()
    SongActions.create(data);
  },

  handleCancel: function () {
    this.props.onCanceled && this.props.onCanceled();
    history.back(-1);
  },

  render: function () {
    return (
      <div className='show-box'>
        <div className='edit-main'>
          <Form ref={ _ => this._form = _ } data={{}}>
            <button className='btn btn-warning mr10' onClick={this.handleSubmit}>{window.lang.add}</button>
            <button className='btn btn-default' onClick={this.handleCancel}>{window.lang.cancel}</button>
          </Form>
        </div>
      </div>
    );
  }
});

module.exports = exports = New;
