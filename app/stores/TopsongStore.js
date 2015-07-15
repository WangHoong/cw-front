var Reflux = require('reflux');
var actions = require('app/actions/TopsongActions');
module.exports = Reflux.createStore({

  listenables: [actions],

  updateUI: function(topsong) {
    this.trigger(topsong);
  },

  onFind: function(){
  },

  onFindCompleted: function(res){
    this.updateUI({
      data: res,
      loaded: true
    });
  },
  getInitialState: function(){
    this.topsong={
      data:{
        data:{
          data: []

      }
    }
    }
    return this.topsong;
  }
});
