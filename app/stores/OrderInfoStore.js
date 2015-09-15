var Reflux = require('reflux');
var actions = require('app/actions/OrderInfoActions');
var assign = require('object-assign');
module.exports = Reflux.createStore({

  listenables: [actions],

  updateUI: function(value) {
    this.trigger(value);
  },
  onGetCompleted: function(res){
    this.orderinfo={
      data:res,
      loaded:true
    }
    this.updateUI(this.orderinfo);
  },

  getInitialState: function() {
    this.orderinfo={
      data:[],
      loaded:false
    }
    return this.orderinfo;
  },
});
