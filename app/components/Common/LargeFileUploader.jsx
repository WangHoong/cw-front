var React = require('react');
var Reflux = require('reflux');
const dbg = require('debug')('topdmc:LargeFileUploader/component');

const LargeFileUploaderStore = require('app/stores/LargeFileUploaderStore');
const LargeFileUploaderActions = require('app/actions/LargeFileUploaderActions');

const LargeFileUploader = React.createClass({

  displayName: "LargeFileUploader>>>Component",

  mixins: [Reflux.connect(LargeFileUploaderStore, "uploadState")],

  getInitialState: function(){
    return {
      uploadState: {
        progress: 0,
        loaded: 0,
        done: false
      }
    };
  },

  getDefaultProps: function(){
    return {
      parentResource: {
        id: 'SongId_a1b2c3',
        type: 'audio_hq'
      }
    }
  },

  _inputFileOnChange: function(e){
    dbg(e.target.files);
    var fileArray = [];
    for(var i = 0, len = e.target.files.length; i < len; i++){
      fileArray.push(e.target.files[i]);
    }
    var frm = this._uploaderForm
    //dbg(frm.reset());
    LargeFileUploaderActions.uploadFiles({
      fileList: fileArray,
      parentResource: this.props.parentResource
    });
  },

  render: function(){
    dbg('render states', this.state.uploadState.progress);
    return (
      <div>
        <form ref={ _ => this._uploaderForm = _ }>
          <input type="file" onChange={this._inputFileOnChange} />
          <progress min="0" max="100" value={this.state.uploadState.progress}>0% complete</progress>
        </form>
      </div>
    );
  }
});

exports = module.exports = LargeFileUploader;
