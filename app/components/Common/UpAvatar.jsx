var React = require('react');
var classNames = require('classnames');
var APIHelper = require('app/utils/APIHelper').APIHelper;

var UpAvatar = React.createClass({

  propTypes: {
    uploadComplete: React.PropTypes.func,
    uploadFailed: React.PropTypes.func,
    type: React.PropTypes.string,
    uploadCanceled: React.PropTypes.func
  },

  getInitialState: function() {
    return {
      isDragActive: false,
      uploading: false,
      src: this.props.src,
      percent: '0%',
      file: {}
    };
  },

  componentWillReceiveProps: function(props) {
    this.setState({
      src: props.src
    });
  },

  /**
   * 获取当前图片的地址
   * @returns {*}
   */
  getValue:function(){
    return {
      src: this.state.src,
      resource_id: this.state.resource_id
    };
  },

  handleClick: function() {
    this.refs['upInput'].getDOMNode().click();
  },

  /**
   * 拖来拖去
   * @param {Object} evt Event
   */
  handleDargOver: function(evt) {
    evt.preventDefault();
    this.setState({
      isDragActive: true
    });
  },

  /**
   * 脱离
   * @param {Object} evt Event
   */
  handleDragLeave: function(evt) {
    this.setState({
      isDragActive: false
    });
  },

  /**
   * 拖放
   * @param {Object} evt Event
   */
  handleDrop: function(evt) {
    evt.preventDefault();
    this.setState({
      isDragActive: false
    });
    var __file = evt.dataTransfer ? evt.dataTransfer.files[0] : evt.target.files[0];
    if (!this.isImage(__file)) return;
    var src = window.URL.createObjectURL(__file);
    this.setState({
      src: src,
      uploading: true,
      file: __file
    }, function() {
      this._upload();
    });
  },

  /**
   * 判断是否为图片
   * @param {Object} file 选择的图片
   * return Boolean
   */
  isImage: function(file) {
    if (file.type.indexOf('image') == 0) {
      if (file.size >= 1024 * 10 * 500) {
        alert('图片应小于5MB');
      } else {
        return true;
      }
    } else {
      alert(file.name + '不是图片');
      return false;
    }
  },

  // 显示进度条
  showProgress: function() {
    if (this.state.uploading) {
      return (
        <div className='progress progress-striped active'>
          <div className='progress-bar' style={{width: this.state.percent}}></div>
        </div>
      );
    } else {
      return '';
    }
  },

  // 上传
  _upload: function() {
    var fd = new FormData();
    fd.append('src', this.state.file);
    var xhr = new XMLHttpRequest();
    xhr.upload.addEventListener('progress', this.uploadProgress, false);
    xhr.addEventListener('load', this.uploadComplete, false);
    xhr.addEventListener('error', this.uploadFailed, false);
    xhr.addEventListener('abort', this.uploadCanceled, false);
    xhr.open('POST', APIHelper.getPrefix() + '/resources/upload?type=' + this.props.type);
    xhr.send(fd);
  },

  /**
   * 上传进度
   * @param {Object} evt Event
   */
  uploadProgress: function(evt) {
    if (evt.lengthComputable) {
      var percentComplete = Math.round(evt.loaded * 100 / evt.total);
      this.setState({
        percent: percentComplete + '%'
      });
    }
  },

  /**
   * 上传完成
   * @param {Object} evt Event
   */
  uploadComplete: function(evt) {
    var data = JSON.parse(evt.target.responseText).src;
    this.setState({
      src: data.fullpath,
      resource_id: data.resource_id,
      uploading: false,
      percent: '0%'
    });
    // 上传完成后回调
    // param {String} _src 图片地址
    this.props.uploadComplete && this.props.uploadComplete(data);
  },

  /**
   * 上传失败
   * @param {Object} evt Event
   */
  uploadFailed: function(evt) {
    // 上传失败回调
    // param {Object} evt Event
    this.props.uploadFailed && this.props.uploadFailed(evt);
  },

  /**
   * 上传中断
   * @param {Object} evt Event
   */
  uploadCanceled: function(evt) {
    // 上传中断回调
    // param {Object} evt Event
    this.props.uploadCanceled && this.props.uploadCanceled(evt);
  },

  render: function() {
    var _className = classNames('up-avatar border', {
      active: this.state.isDragActive
    });
    var photoStyles
    if(this.state.src){
      photoStyles = {
        backgroundImage: 'url(' + this.state.src + ')'
      };
    }else{
      photoStyles = {
        backgroundImage: 'url(images/use2.png)'
      };
    }
    return (
      <div
        className={_className}
        onClick={this.handleClick}
        onDrop={this.handleDrop}
        onDragOver={this.handleDargOver}
        onDragLeave={this.handleDragLeave}>
          <div className='photo' style={photoStyles}></div>
          <div className='tips'>
            <span>{window.lang.upload}</span>
          </div>
          <input type='file' ref='upInput' onChange={this.handleDrop} />
          {this.showProgress()}
      </div>
    );
  }

});

module.exports = UpAvatar;
