import React from 'react';
// import Uploader from './Uploader.jsx';
// import {APIHelper} from 'app/utils/APIHelper';

class GlobalUploadTip extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      show: window.__UPLOADMP3__.show,
      queue: window.__UPLOADMP3__.queue,
      menuDisplay: 'none'
    }
  }

  componentDidMount() {
    var self = this
    var q = self.state.queue
    if( q.length !== 0 ) {
      if( q[0].status === -1) {
        q[0].status = 2
        self.uploadFile(q[0])
      }
    }
  }

  componentDidUpdate() {
    var self = this
    var q = self.state.queue
    if( q.length !== 0 ) {
      if( q[0].status === -1) {
        q[0].status = 2
        self.uploadFile(q[0])
      }
    }
  }

  uploadFile(data) {
    const xhr = new XMLHttpRequest();
    xhr.open('PUT', data.putPath, true);
    xhr.setRequestHeader('Content-Type', 'application/octet-stream');

    const formData = new FormData();
    formData.append('Filedata', data.file);

    // for (let key in that.params) {
    //   formData.append(key, that.params[key]);
    // }
    var self = this;

    // error handler
    xhr.onerror = function() {
      var message = this.statusText || 'upload failed';
      self.state.tips = data.fileName + '上传失败';
      self.setState(self.state);
      self.uploadFile(self.state.queue[0])
      // if (self.props.onUploadError) {
      //   self.props.onUploadError(new Error(message, this.status));
      // }
    };

    xhr.onload = function() {
      if (this.status === 200) {
        self.state.tips = data.fileName + '上传成功';
        self.setState(self.state);
        window.__UPLOADMP3__.queue.shift()
        if( window.__UPLOADMP3__.queue.length === 0 ) {
          window.__UPLOADMP3__.show = false
        }
        self.state.show = window.__UPLOADMP3__.show
        self.state.queue = window.__UPLOADMP3__.queue
        self.setState(self.state)

        // self.setState(this.state);
        if (self.props.onUploaded) {
          // let data = {};
          try {
            // data = JSON.parse(this.response);
          } finally {

          }
          // self.props.onUploaded(data);
        }
      } else {
        self.uploadFile(self.state.queue[0])
        if (self.props.onUploadError) {
          self.props.onUploadError(new Error(this.response, this.status))
        }
      }
    };

    xhr.upload.onprogress = function(event) {
      if (event.lengthComputable) {
        var progress = (event.loaded / event.total * 100 | 0);
        // window.__UPLOADMP3__.queue[0].percent = progress;
        // window.__UPLOADMP3__.tips = data.fileName + '上传中...';
        self.state.queue[0].percent = progress;
        self.state.tips = data.fileName + '上传中...';
        self.setState(self.state);
        // if (self.props.onProgress) {
        //   self.props.onProgress(progress);
        // }
      }
    };

    self.state.show = window.__UPLOADMP3__.show = true
    self.setState(self.state)
    xhr.send(formData);
  }

  toggle(e) {
    e.preventDefault();
    this.state.menuDisplay = (this.state.menuDisplay === 'none') ? 'block' : 'none'
    this.setState(this.state)
  }
  render() {
    // const progressStyle = {
    //   width: this.state.percent + '%'
    // };
    var render = <div></div>
    var self = this
    if (this.state.show) {
      var queue = this.state.queue.map(function(item, i, arr){
        var tips = ''
        var percent = item.percent
        var fileName = item.fileName
        var progressStyle
        switch (item.status) {
          case -1:
            tips = `${fileName}  等待中`
            progressStyle = {
              width: '0%'
            }
            break;
          case 0:
            tips = `${fileName}  上传失败`
            progressStyle = {
              width: '0%'
            }
            break;
          case 1:
            tips = `${fileName}  上传成功`
            progressStyle = {
              width: '100%'
            }
            break;
          case 2:
            tips = `${fileName}  上传中...`
            progressStyle = {
              width: percent + '%'
            }
            break;
          default:
            tips = ''
        }
        if( i===0 && arr.length>1) {
          return (
            <div key={i} className='dropdown-toggle mp3-upload-box' onClick={self.toggle.bind(self)}>
              <div className='queue-mp3-upload'>
                <p className='mp3-upload-tips'>
                  {tips}
                  <span className="caret"></span>
                </p>
                <div className='mp3-upload-progress'>
                  <div style={progressStyle}>
                  </div>
                </div>
              </div>
            </div>
          )
        } else {
          return (
            <div key={i} className='mp3-upload-box'>
              <div className='queue-mp3-upload'>
                <p className='mp3-upload-tips'>{tips}</p>
                <div className='mp3-upload-progress'>
                  <div style={progressStyle}>
                  </div>
                </div>
              </div>
            </div>
          )
        }
      })
      // render = <div>{this.state.queue[0].fileName}</div>
      // render = <div>{queue}</div>

    }
    // return (
    //   <div>{render}</div>
    // )
    var menuStyle = {
      width: '100%',
      padding: 0,
      border: 'none',
      margin: 0,
      display: self.state.menuDisplay
    }
    return (
      <div className="dropdown" style={{margin: "0px -15px"}}>
        {queue && queue.slice(0, 1)}
        <ul className="dropdown-menu" aria-labelledby="dropdownMenu1"
          style={menuStyle}>
          {queue && queue.slice(1)}
        </ul>
      </div>
    )
  }

};

export default GlobalUploadTip;
