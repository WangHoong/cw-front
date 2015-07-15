var Reflux = require('reflux');
var actions = require('app/actions/TopsingerActions');
var assign = require('object-assign');
module.exports = Reflux.createStore({

  listenables: [actions],

  updateUI: function(topsinger) {
    this.trigger(topsinger);
  },

  onFind: function(){
  },

  onFindCompleted: function(res){
    this.updateUI({
      data: res,
      loaded: true
    });

  },


  getInitialState: function() {
    this.topsinger={
      data:{
        data:{
        data: [
        ]
      }
    }
    }
    return this.topsinger;
  },
});
