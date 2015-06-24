var ArtistStore = require('../../stores/ArtistStore');
var ArtistActions = require('../../actions/ArtistActions');
var Form = require('./Form.jsx');

/**
 * 新建歌手
 */
var New = React.createClass({

    mixins: [Reflux.connect(ArtistStore, 'artist')],

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
        if (nextState.artist.created === true) {
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
        ArtistActions.create(data);
    },

    handleCancel: function () {
        this.props.onCanceled && this.props.onCanceled();
        history.back(-1);
    },

    render: function () {
        return (
          <div className='show-box'>
            <div className='edit-main'>
                <Form ref="form" data={{}}>
                    <button className='btn btn-warning mr10' onClick={this.handleSubmit}>新建</button>
                    <button className='btn btn-default' onClick={this.handleCancel}>放弃</button>
                </Form>
            </div>
          </div>
        );
    }
});

module.exports = exports = New;
