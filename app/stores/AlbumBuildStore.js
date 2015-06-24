/*global Reflux*/
var actions = require('../actions/AlbumActions');
var assign = require('object-assign');

module.exports = Reflux.createStore({

  listenables: [actions],

  init: function() {
    this.album = {
      data:{},
      loaded:false
    };
  },

  getInitialState: function() {
    return this.album;
  },

  onFindCompleted: function(res) {
    this.album.data = res.data.data;
    this.album.loaded=true;
    this.trigger(this.album);
  },
  onBuildCompleted: function (obj) {
    console.log(obj);
    console.log(this.album.data.items);
    var id=obj.data.data.id;
    var company_id=obj.data.data.company_id;
    var company={
      company:{name:'当前公司'}
    }
    for(var i=0;i<this.album.data.items.length;i++){
      if(this.album.data.items[i].id==id){
        this.album.data.items[i].company_id=company_id;
        this.album.data.items[i] = assign(this.album.data.items[i] || {}, company);
      }
    }
    this.trigger(this.album);
  }

  /**
   * 服务端请求数据之前触发
   */
  // onFind: function() {
  //   this.notifyUI({
  //     items: [],
  //     total: 0,
  //     page: 0,
  //     totalPage: 0
  //   });
  // },
  //
  // /**
  //  * 查找完成显示数据触发
  //  * @param res
  //  */
  // onFindCompleted: function(res) {
  //   if (res.data.page) {
  //     res.data.page = Math.max(0, res.data.page - 1);
  //   }
  //   res.data.data.loaded=true;
  //   this.notifyUI(res.data.data);
  // },
  //
  // /**
  //  * 服务端请求数据之前触发
  //  */
  // onSearch: function() {
  //   this.notifyUI({
  //     items: [],
  //     total: 0,
  //     page: 0,
  //     totalPage: 0
  //   });
  // },
  //
  // /**
  //  * 查找完成显示数据触发
  //  * @param res
  //  */
  // onSearchCompleted: function(res) {
  //   if (res.data.page) {
  //     res.data.page = Math.max(0, res.data.page - 1);
  //   }
  //   res.data.data.loaded=true;
  //   this.notifyUI(res.data.data);
  // },
  // onBulid: function(attributes){
  //   this.album.data = assign(this.album.data.data || {}, attributes);
  //   this.updateUI({
  //     data: this.album.data,
  //     bulided: false
  //   });
  //
  //
  // },
  // onBulidCompleted: function (obj) {
  //   var currentData = obj.data.data;
  //   this.updateUI({
  //     data: this.album.data,
  //     bulided: true
  //   });
  //   console.log(this.album);
  //   console.log(obj);
  // },
  //
  // notifyUI: function(snaphot) {
  //   this.trigger(snaphot);
  // },
  //
  // getInitialState: function() {
  //   return {
  //     items: [],
  //     total: 0,
  //     page: 0,
  //     totalPage: 0
  //   };
  // }

});
