import React from 'react';
import {APIHelper} from 'app/utils/APIHelper';

class Mp3Uploader extends React.Component {
  constructor(props) {
    super(props);
    this.file = {};
    this.state = {
      percent: 0,
      tips: this.props.tips,
      borderWidth: '0px'
    };
    this.uploadFile = this.uploadFile.bind(this);
    this.handleInputClick = this.handleInputClick.bind(this);
    this.handleDrop = this.handleDrop.bind(this);
    this.handleDragEnter = this.handleDragEnter.bind(this);
    this.handleDragLeave = this.handleDragLeave.bind(this);
    this.uploadProgress = this.uploadProgress.bind(this);
    this.uploadComplete = this.uploadComplete.bind(this);
  }

  uploadFile() {
    let fd = new FormData();
    fd.append('mp3', this.file);
    let xhr = new XMLHttpRequest();
    xhr.upload.addEventListener('progress', this.uploadProgress, false);
    xhr.addEventListener('load', this.uploadComplete, false);
    xhr.addEventListener('error', this.uploadFailed, false);
    xhr.addEventListener('abort', this.uploadCanceled, false);
    xhr.open('POST', window.DMC_OPT.UPLOAD_FILE_URL + '/resources/upload?type=track_audio');
    xhr.send(fd);
  }

  uploadProgress(evt) {
    this.state.percent = Math.round(evt.loaded * 100 / evt.total);
    this.setState(this.state);
  }

  uploadComplete(evt) {
    this.state.tips = '上传成功';
    this.setState(this.state);
  }

  uploadFailed(evt) {
    this.state.tips = '上传失败';
    this.setState(this.state);
  }

  uploadCanceled(evt) {
    this.state.tips = '取消上传';
    this.setState(this.state);
  }

  handleDragEnter(evt) {
    evt.preventDefault();
    this.state.borderWidth = '1px';
    this.setState(this.state);
  }

  handleDragLeave(evt) {
    evt.preventDefault();
    this.state.borderWidth = '0px';
    this.setState(this.state);
  }

  handleDragOver(evt) {
    evt.preventDefault();
    this.state.borderWidth = '0px';
    this.setState(this.state);
  }

  handleDrop(evt) {
    evt.preventDefault();
    this.file = evt.dataTransfer ? evt.dataTransfer.files[0] : evt.target.files[0];
    if (this.file.type.indexOf('audio/mp3') == -1) {
      alert('请上传MP3文件');
      return;
    }
    this.state.tips = '开始上传';
    this.state.borderWidth = '0px';
    this.setState(this.state);
    this.uploadFile();
  }

  handleInputClick() {
    this.refs['mp3_upload_input'].getDOMNode().click();
  }

  render() {
    let progressStyle = {
      width: this.state.percent + '%'
    };
    let borderStyle = {
      borderWidth: this.state.borderWidth
    };
    return (
      <div className='mp3-upload-box'>
        <div
          className='mp3-upload'
          onDrop={this.handleDrop}
          onDragEnter={this.handleDragEnter}
          onDragLeave={this.handleDragLeave}
          onDragOver={this.handleDragOver}
          onClick={this.handleInputClick}
          style={borderStyle}>
          <p className='mp3-upload-tips'>{this.state.tips}</p>
          <div className='mp3-upload-progress'><div style={progressStyle}></div></div>
          <form>
            <input ref='mp3_upload_input' type='file' onChange={this.handleDrop} />
          </form>
        </div>
      </div>
    );
  }
};

export default Mp3Uploader;
