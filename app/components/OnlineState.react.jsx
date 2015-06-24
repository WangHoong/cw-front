'use strict';

// const React = require('react');
// const Reflux = require('reflux');
const dbg = require('debug')('topdmc:OnlineState/component');

const OnlineStateStore = require('app/stores/OnlineStateStore');

exports = module.exports = React.createClass({

  displayName: "OnlineState>>>Component",

  statics: {
    buildCssClassName: function(_state){
      return 'OnlineState_' + _state;
    }
  },

  mixins: [Reflux.connect(OnlineStateStore, "onlineState")],

  getInitialState: function(){
    // dbg('getInitialState');
    // return { onlineState: 'Unknown' };
  },

  getDefaultProps: function(){
    // dbg('getDefaultProps');
    return { cc: 'fanweixiao' };
  },

  componentWillMount: function(){
    // dbg('componentWillMount');
  },

  componentDidMount: function(){
    // dbg('componentDidMount');
  },

  componentWillReceiveProps: function(nextProps){
    // dbg('componentWillReceiveProps >> args', nextProps);
  },

  shouldComponentUpdate: function(nextProps, nextState){
    // dbg('shouldComponentUpdate');
    let changed = this.state.onlineState !== nextState.onlineState;
    dbg('shouldComponentUpdate changed: ' + changed, this.state.onlineState + ' => ' + nextState.onlineState);
    return changed;
  },

  componentDidUpdate: function(prevProps, prevState){
    // dbg('componentDidUpdate >> prevProps', prevProps);
    // dbg('componentDidUpdate >> prevState', prevState);
  },

  componentWillUnmount: function(){
    dbg('componentWillUnmount');
  },

  render: function(){
    // dbg('render::state', this.state);
    return (
      <div>
        <span>Online State: </span>
        <cite className={"OnlineState_" + this.state.onlineState}>{this.state.onlineState}</cite>
      </div>
    );
  }

});
