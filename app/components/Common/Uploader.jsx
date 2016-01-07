import React from 'react';

class Uploader extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      file: ''
    };
    this.url = props.url || '';
    this.method = props.method || 'POST';
    this.params = props.params || {};
  }

  upload() {
    let fileInput = this._uploadInput
    fileInput.click();
  }

  _upload(evt) {
    const file = evt.target.files[0];
    this.state.file = file;

    const xhr = new XMLHttpRequest();
    xhr.open(this.method, this.url, true);

    const formData = new FormData();
    formData.append('Filedata', this.state.file);

    for (let key in this.params) {
      formData.append(key, this.params[key]);
    }
    var self = this;

    // error handler
    xhr.onerror = function() {
      var message = this.statusText || 'upload failed';
      if (self.props.onUploadError) {
        self.props.onUploadError(new Error(message, this.status));
      }
    };

    xhr.onload = function() {
      if (this.status === 200) {
        if (self.props.onUploaded) {
          let data = {};
          try {
            data = JSON.parse(this.response);
          } finally {

          }
          self.props.onUploaded(data);
        }
      } else {
        if (self.props.onUploadError) {
          self.props.onUploadError(new Error(this.response, this.status))
        }
      }
    };

    xhr.upload.onprogress = function(event) {
      if (event.lengthComputable) {
        var progress = (event.loaded / event.total * 100 | 0);
        if (self.props.onProgress) {
          self.props.onProgress(progress);
        }
      }
    };
    xhr.send(formData);
  }

  render() {
    return (
      <input type='file' style={{display: 'none'}} ref={ _ => this._uploadInput = _ } onChange={this._upload.bind(this)}/>
    );
  }
}

Uploader.propTypes = {
  url: React.PropTypes.string.isRequired,
  onUploadError: React.PropTypes.func.isRequired,
  onUploaded: React.PropTypes.func.isRequired,
  onProgress: React.PropTypes.func.isRequired,
  params: React.PropTypes.object
};

export default Uploader;
