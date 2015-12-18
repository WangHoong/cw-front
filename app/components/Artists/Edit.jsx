var React = require('react');
var Reflux = require('reflux');
var ArtistStore = require('../../stores/ArtistStore');
var ArtistActions = require('../../actions/ArtistActions');
var Form = require('./Form.jsx');
var Loader = require('../Common/Loader.jsx');

/**
 * 编辑歌手
 */
var Edit = React.createClass({

  mixins: [Reflux.connect(ArtistStore, 'artist')],

  propTypes: {
    id: React.PropTypes.string.isRequired,
    onUpdated: React.PropTypes.func,
    onCancelClick: React.PropTypes.func.isRequired
  },

  componentDidMount: function () {
    ArtistActions.get(this.props.id);
  },

  /**
   * 保存成功后进行事件的通知
   * @param nextProps
   * @param nextState
   */
  componentWillUpdate: function (nextProps, nextState) {
    if (nextState.artist.updated === true) {
      this.props.onUpdated(nextState);
    }
  },

  /**
   * 保存处理
   * @param e
   */
  handleSubmit: function () {
    var data = this.refs.form.getValue();
    ArtistActions.update(this.props.id, data);
  },

  render: function () {
    if (this.state.artist.loaded==false) {
      return (<Loader/>);
    }

    return (
      <Form ref="form" data={this.state.artist.data}>
        <button className='btn btn-warning mr10' onClick={this.handleSubmit}>保存</button>
        <button className='btn btn-default' onClick={this.props.onCancelClick}>{window.lang.cancel}</button>
      </Form>
    );
  }
});

module.exports = exports = Edit;
