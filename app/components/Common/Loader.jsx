var React = require('react');
var Loader=React.createClass({

    render:function(){
      return (
        <div className='loading'>
          <div className='bounce1'></div>
          <div className='bounce2'></div>
          <div className='bounce3'></div>
        </div>
      )
    }
});

module.exports=Loader;
