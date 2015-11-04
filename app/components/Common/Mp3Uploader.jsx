import React from 'react';
import Uploader from './Uploader.jsx';
import {APIHelper} from 'app/utils/APIHelper';

class Mp3Uploader extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      percent: 0,
      tips: this.props.tips,
      borderWidth: '0px'
    };
  }

  uploadComplete(data) {
    this.state.tips = '上传成功';
    this.props.uploadComplete(data);
    this.setState(this.state);
  }

  uploadError(err) {
    this.state.tips = '上传失败';
    this.setState(this.state);
  }

  progress(progress) {
    this.state.percent = progress;
    this.setState(this.state);
  }

  upload() {
    this.refs.upload.upload();
  }

  render() {
    const progressStyle = {
      width: this.state.percent + '%'
    };
    const borderStyle = {
      borderWidth: this.state.borderWidth
    };
    return (
      <div className='mp3-upload-box' onClick={() => {this.upload()}}>
        <div className='mp3-upload'>
          <p className='mp3-upload-tips'>{this.state.tips}</p>
          <div className='mp3-upload-progress'><div style={progressStyle}></div></div>
          <Uploader ref='upload'
            onUploaded={(data) => {this.uploadComplete(data)}}
            onUploadError={(err) => {this.uploadError(err)}}
            onProgress={(progress) => {this.progress(progress)}}
            url={`${window.DMC_OPT.UPLOAD_FILE_URL}/resources/upload?type=track_audio`} />
        </div>
      </div>
    );
  }

};

Mp3Uploader.propTypes = {
  uploadComplete: React.PropTypes.func.isRequired
};

export default Mp3Uploader;
