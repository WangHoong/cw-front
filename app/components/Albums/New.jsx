var AlbumStore = require('../../stores/AlbumStore');
var AlbumActions = require('../../actions/AlbumActions');

var Form = require('./Form.jsx');

var New = React.createClass({

  mixins: [Reflux.connect(AlbumStore, 'album')],

  /**
   * 创建成功后进行事件的通知
   * @param nextProps
   * @param nextState
   */
  componentWillUpdate: function(nextProps, nextState) {
    if (nextState.album.created === true) {
      history.back(-1);
    }
  },

  /**
   * 保存处理
   * @param event
   */
  handleSubmit: function() {
    var data = this.refs.form.getValue();
    AlbumActions.create(data);
  },

  handleCancel: function() {
    history.back(-1);
  },

  render: function() {
    return (
      <div className='show-box'>
        <div className='edit-main'>
          <Form ref='form' data={{}}>
            <button className='btn btn-warning mr10' onClick={this.handleSubmit}>新建</button>
            <button className='btn btn-default' onClick={this.handleCancel}>放弃</button>
          </Form>
        </div>
      </div>
    );
  }

});

module.exports = New;
