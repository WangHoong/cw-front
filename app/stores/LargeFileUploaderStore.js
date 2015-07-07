var Reflux = require('reflux');
const dbg = require('debug')('topdmc:LargeFileUploader/Store');
const LargeFileUploaderActions = require('app/actions/LargeFileUploaderActions');

/*
* 上传单个文件前，首先请求服务器，获取对应的ResourceID
* @param parent 该资源的隶属，至少包含ID和Type来描述
*/
function acquireResourceID(parent){
	// First of all, Get ResourceID from server
	var preflightURL = '/upload?parent_id=' + parent.id + '&type=' + parent.type;
	var deferred = new Promise(function(resolve, reject){
		var data = new FormData();
		data.append('parent_id', parent.id);
		data.append('type', parent.type);

		var xhr2 = new XMLHttpRequest();
		xhr2.open('GET', preflightURL, true);
		xhr2.withCredentials = true;
		xhr2.onload = function(){
			if(this.status == 200){
				var uuid = this.response;
				resolve(uuid);
			} else {
				reject(this.status);
			}
		};
		xhr2.onerror = function(evt){
			console.error(evt);
			reject(evt);
		};

		xhr2.send(data);
	});

	return deferred;
}

/*
* 上传单个文件
* @param fileBlob 要上传的文件
* @param totalSize 批量上传时所有文件的总大小
* @param loaded 批量上传时已上传内容总大小
* @param onprogress 上传过程中的进度变化接收者
* @returns DeferredObject 返回Promise
*/
function createUploadWorker(fileBlob, totalSize, _totalLoaded, onprogress){
	var deferred = new Promise(function(resolve, reject){
		// 构建Worker要加载的js脚本，使用Blob
		var blob = new Blob([document.getElementById('cc_worker').textContent], { type: 'text/javascript' });
		var blobURL = window.URL.createObjectURL(blob);
		// 构建worker(ObjectURL way)
		var worker = new Worker(blobURL);

		/* 构建worker(javascript url way)
		//var worker = new Worker('upload_worker.js');
		*/
		// 设置id，方便debug
		worker.id = (new Date()).valueOf();
		console.info('create worker[' + worker.id + ']: ', 'filename=' + fileBlob.name + ', resourceID=' + fileBlob.resourceID);
		// 上传过程中的时间响应
		// TODO: 要添加error处理，reject掉
		worker.onmessage = function(e){
			var res = e.data;
			if(res.type == 'error'){
				reject(res);
			} else {
				if(res.loaded){
					onprogress(res);
				} else {
					if(res.done){
						// 上传完成后要清理worker
						dbg('\tComplete file [' + fileBlob.name + '], Destroy worker: ', worker.id);
						worker = null;
						resolve(fileBlob);
					} else {
						dbg('$$$$-------->', res);
					}
				}
			}
		};
		// 传递消息到worker触发worker进行
		worker.postMessage({
			file: fileBlob,
			resourceID: fileBlob.resourceID,
			totalSize: totalSize,
			totalLoaded: _totalLoaded,
			windowSize: window.DMC_UPLOAD_WINDOW_SIZE || 1024 * 100,
			remoteServer: window.DMC_UPLOAD_SERVER || 'lo.topdmc.com'
		});
	});

	return deferred;
}

/*
* UploadFile
*/
function uploadFile(parent, file, size, _totalLoaded, onprogress){
	return acquireResourceID(parent).then(function(resourceID){
			// because of file.name is read-only, so we set a new property
			file.resourceID = resourceID;
			return createUploadWorker(file, size, _totalLoaded, onprogress);
		}, function(err){
			console.error('uploadFile', err);
		});
}

/*
* 批量顺序的上传多个文件
*
* @param files 要上传的文件数组
* @param onprogress 上传过程中的进度变化接受者
* @returns DeferredObject 返回Promise
*/
function createUploadMultipleWorker(parent, files, onprogress){
	// 计算本次批量上传的文件的总大小
	var size = files.reduce(function(memo, curr){
		memo += curr.size;
		return memo;
	}, 0);
	console.info('[createUploadMultipleWorker]', 'total files: ', files.length, ', total size: ', size);
	// 批量上传时所有已上传的总大小
	var _totalLoaded = 0;
	// 按顺序一个一个的执行任务
	return files.reduce(function(promise, file){
		return promise.then(function(){
			return uploadFile(parent, file, size, _totalLoaded, onprogress);
		}).then(function(fileBlob){
			// 每文件上传完成，改写已完成上传内容大小的值
			_totalLoaded += fileBlob.size;
		}).catch(function(err){
			console.error('Upload file failed:', file.name, ', errors=', err);
		});
	}, Promise.resolve());
}

const LargeFileUploaderStore = Reflux.createStore({
	listenables: LargeFileUploaderActions,

  onUploadFiles: function(payload){
		var self = this;
		dbg('onUploadFiles', payload);
		function onProgressChange(p){
			dbg('>>onProgressChange', p);
			self.trigger({
				done: false,
				loaded: p.loaded,
				progress: (p.loaded / p.total) * 100
			});
		}
		createUploadMultipleWorker(payload.parentResource, payload.fileList, onProgressChange).then(function(){
			// batch upload successful, Reset file picker
			dbg('createUploadMultipleWorker.then() invoked');
			var uploadState = {
				done: true,
				loaded: 100,
				progress: 100
			};
			self.trigger(uploadState);
		}).catch(function(err){
			console.error(err);
			self.trigger({
				done: true,
				error: err,
				loaded: 70,
				progress: 20
			});
		});
  }

});

exports = module.exports = LargeFileUploaderStore;
