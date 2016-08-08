import React from 'react';

class Uploader extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      file: ''
    };
    this.url = props.url || '';
    this.method = props.method || 'PUT';
    this.params = props.params || {};
  }

  componentDidMount() {
    window.__UPLOADMP3__.__temFile__128k = undefined
    window.__UPLOADMP3__.__temFile__320k = undefined
  }

  upload() {
    let fileInput = React.findDOMNode(this.refs['upload-input']);
    fileInput.click();
  }

  _upload(evt) {
    const file = evt.target.files[0];
    var file_name = file.name
    this.state.file = file;
    var url = `${window.DMC_OPT.API_PREFIX}/resources/presigned?type=track_audio`
    var that = this
    $.ajax({
      type: "POST",
      url: url,
      data: JSON.stringify({
        file_name
      }),
      contentType: "application/json",
      dataType: 'json',
      success: function (data) {
        // $.ajax({
        //     type : 'PUT',
        //     url : data.data.putpath,
        //     data : file,
        //     processData: false,  // tell jQuery not to convert to form data
        //     contentType: file.type,
        //     success: function(json) { console.log('Upload complete!') },
        //     error: function (XMLHttpRequest, textStatus, errorThrown) {
        //         console.log('Upload error: ' + XMLHttpRequest.responseText);
        //     }
        // });

        const xhr = new XMLHttpRequest();
        xhr.open('PUT', data.data.put_path, true);
        xhr.setRequestHeader('Content-Type', 'application/octet-stream');

        const formData = new FormData();
        formData.append('Filedata', that.state.file);

        for (let key in that.params) {
          formData.append(key, that.params[key]);
        }
        var self = that;

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
              // let data = {};
              try {
                // data = JSON.parse(this.response);
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

    })
  }

  inUploadQueue(file, fileName, fullPath, putPath) {
    window.__UPLOADMP3__.queue.push({
      file,
      fileName,
      fullPath,
      putPath,
      status: -1,
    })
    window.__UPLOADMP3__.show = true
  }

  preregined(e) {
    const file = e.target.files[0];
    var file_name = file.name
    this.state.file = file;
    var url = `${window.DMC_OPT.API_PREFIX}/resources/presigned?type=track_audio`
    var that = this
    $.ajax({
      type: "POST",
      url: url,
      data: JSON.stringify({
        file_name
      }),
      contentType: "application/json",
      dataType: 'json',
      success: function (data) {
        // $.ajax({
        //     type : 'PUT',
        //     url : data.data.putpath,
        //     data : file,
        //     processData: false,  // tell jQuery not to convert to form data
        //     contentType: file.type,
        //     success: function(json) { console.log('Upload complete!') },
        //     error: function (XMLHttpRequest, textStatus, errorThrown) {
        //         console.log('Upload error: ' + XMLHttpRequest.responseText);
        //     }
        // });
        that.props.onUploaded(data, file_name);
        // TODO
        // that.props.getFullpath(data)
        // that.inUploadQueue(file, file_name, data.data.fullpath, data.data.put_path)
        window.__UPLOADMP3__[`__temFile__${that.props.rate}`] = {
          file,
          fileName: file_name,
          fullPath: data.data.fullpath,
          putPath: data.data.put_path,
          status: -1,
        }


      //   const xhr = new XMLHttpRequest();
      //   xhr.open('PUT', data.data.put_path, true);
      //   xhr.setRequestHeader('Content-Type', 'application/octet-stream');
      //
      //   const formData = new FormData();
      //   formData.append('Filedata', that.state.file);
      //
      //   for (let key in that.params) {
      //     formData.append(key, that.params[key]);
      //   }
      //   var self = that;
      //
      //   // error handler
      //   xhr.onerror = function() {
      //     var message = this.statusText || 'upload failed';
      //     if (self.props.onUploadError) {
      //       self.props.onUploadError(new Error(message, this.status));
      //     }
      //   };
      //
      //   xhr.onload = function() {
      //     if (this.status === 200) {
      //       if (self.props.onUploaded) {
      //         // let data = {};
      //         try {
      //           // data = JSON.parse(this.response);
      //         } finally {
      //
      //         }
      //         self.props.onUploaded(data);
      //       }
      //     } else {
      //       if (self.props.onUploadError) {
      //         self.props.onUploadError(new Error(this.response, this.status))
      //       }
      //     }
      //   };
      //
      //   xhr.upload.onprogress = function(event) {
      //     if (event.lengthComputable) {
      //       var progress = (event.loaded / event.total * 100 | 0);
      //       if (self.props.onProgress) {
      //         self.props.onProgress(progress);
      //       }
      //     }
      //   };
      //   xhr.send(formData);
      }

    })
  }

  render() {
    return (
      <input type='file' style={{display: 'none'}} ref='upload-input' accept="audio/mpeg"
        onChange={this.preregined.bind(this)}
        rate={this.props.rate}
      />
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
