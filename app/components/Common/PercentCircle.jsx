var dbg = require('debug')('topdmc:Common/PercentCircle');
var PercentCircle = React.createClass({
    componentDidMount: function() {
      jQuery(".data-attributes .percentCircle").peity("donut");
    },

  render: function(){

    var songNumber=this.props.percent[0].split('/');
    var songPercent=(songNumber[0]/songNumber[1]*100).toFixed(0)+"%";
    var singerNumber=this.props.percent[1].split('/');
    var singerPercent=(singerNumber[0]/singerNumber[1]*100).toFixed(0)+"%";
    var specialNumber=this.props.percent[2].split('/');
    dbg(specialNumber)
    var specialPercent=(specialNumber[0]/specialNumber[1]*100).toFixed(0)+"%";

    return(
        <div className="datum-cpn">
        <p className="percentTitle"><b>资料完成度</b></p>
        <p className="data-attributes">
          <span className="percentCircle" data-peity='{ "fill": ["#f48daf", "#f6e8ed"], "innerRadius": 34, "radius": 40 }'>{this.props.percent[0]}</span>
          <span className="percentCircle" data-peity='{ "fill": ["#62a1d5", "#dbedfb"], "innerRadius": 34, "radius": 40 }'>{this.props.percent[1]}</span>
          <span className="percentCircle" data-peity='{ "fill": ["#2ed0d7", "#d0f2f3"], "innerRadius": 34, "radius": 40 }'>{this.props.percent[2]}</span>
        </p>
        <p className="percentNumber">
          <span ><a href="#/songs">{songPercent}</a></span>
          <span ><a href="#/artists">{singerPercent}</a></span>
          <span ><a href="#/albums">{specialPercent}</a></span>
        </p>
        <p className="percentName">
          <span ><a href="#/songs">歌曲资料</a></span>
          <span ><a href="#/artists">歌手资料</a></span>
          <span ><a href="#/albums">专辑资料</a></span>
        </p>
        </div>
    )
  }
})
module.exports = PercentCircle;
