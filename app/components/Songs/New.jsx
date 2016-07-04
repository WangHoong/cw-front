var React = require('react');
var Reflux = require('reflux');
var SongStore = require('../../stores/SongStore');
var SongActions = require('../../actions/SongActions');
var Form = require('./Form.jsx');
var _ = require('lodash')

/**
 * 新建歌手
 */
var New = React.createClass({

  mixins: [Reflux.connect(SongStore, 'song')],

  propTypes: {
    onCreated: React.PropTypes.func, // 创建完成后的事件
    onCanceled: React.PropTypes.func.isRequired // 取消创建的事件
  },

  getInitialState: function () {
    return {
      errorTips: ''
    }
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
    var data = this.refs.form.getValue();
    var errorTips = ''
    if (window.__HASPOWER__) {
      if (data.name === '' || data.name === undefined) {
        errorTips = 'Enter track name.'
      } else if (data.artists.length === 0) {
        errorTips = 'Add artists.'
      } else if (_.isEmpty(data.album)) {
        errorTips = 'Add album.'
      } else {
        SongActions.create(data);
      }
      this.setState({
        errorTips: errorTips
      })
    } else {
      SongActions.create(data);
    }
  },

  handleCancel: function () {
    this.props.onCanceled && this.props.onCanceled();
    history.back(-1);
  },

  render: function () {
    var hasPower = window.__HASPOWER__
    var errorTips = React.createElement(
      'span',
      {style: {marginRight: "10px", color: "#fa3e3e"}},
      this.state.errorTips
    )
    return (
      <div className='show-box'>
        <div className='edit-main'>
          <Form ref="form" data={{}}>
            { hasPower ? errorTips : null }
            <button className='btn btn-warning mr10' onClick={this.handleSubmit}>{window.lang.add}</button>
            <button className='btn btn-default' onClick={this.handleCancel}>{window.lang.cancel}</button>
          </Form>
        </div>
      </div>
    );
  }
});

module.exports = exports = New;
