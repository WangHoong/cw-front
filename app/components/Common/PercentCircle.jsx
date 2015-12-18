var React = require('react');
var dbg = require('debug')('topdmc:Common/PercentCircle');
var CirCanvasProcess = require('./CirCanvasProcess.jsx');
var PercentCircle = React.createClass({

  render: function(){

    var songNumber=this.props.percent[0].split('/');
    var songPercent=(songNumber[0]/songNumber[1]*100).toFixed(0);
    var singerNumber=this.props.percent[1].split('/');
    var singerPercent=(singerNumber[0]/singerNumber[1]*100).toFixed(0);
    var specialNumber=this.props.percent[2].split('/');
    var specialPercent=(specialNumber[0]/specialNumber[1]*100).toFixed(0);

    return(
      <div className='datum-percent'>
        <p>{window.lang.pr0}</p>
        <ul className='row'>
          <li className='col-xs-4'>
            <CirCanvasProcess process={songPercent} color='#f48daf' height='120' width='120' />
            <p>{window.lang.pr1}</p>
          </li>
          <li className='col-xs-4'>
            <CirCanvasProcess process={singerPercent} color='#62a1d5' height='120' width='120' />
            <p>{window.lang.pr2}</p>
          </li>
          <li className='col-xs-4'>
            <CirCanvasProcess process={specialPercent} color='#2ed0d7' height='120' width='120' />
            <p>{window.lang.pr3}</p>
          </li>
        </ul>
      </div>
    )
  }
})
module.exports = PercentCircle;
