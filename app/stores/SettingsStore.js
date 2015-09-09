var Reflux = require('reflux');
var actions = require('app/actions/SettingsActions');
var assign = require('object-assign');
module.exports = Reflux.createStore({

  listenables: [actions],

  updateUI: function(value) {
    this.trigger(value);
  },
  onFindCompleted: function(res){
    this.updateUI({
      data: res,
      loaded: true
    });
  },
  getInitialState: function() {
    this.companies={
      data:[],
      loaded:false
    }
    return this.companies;
  },
});
