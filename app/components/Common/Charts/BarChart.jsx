
var BarChart = React.createClass({
  componentDidMount: function() {
    var $self = echarts.init(React.findDOMNode(this.refs.renderDOMNode))

    var option = this.props.option ||  {
      title : {
        text: '未来一周气温变化',
        subtext: '纯属虚构'
      },
      tooltip : {
        trigger: 'axis'
      },
      legend: {
        data:['最高气温','最低气温']
      },
      toolbox: {
        show : true,
        feature : {
          mark : {show: true},
          dataView : {show: true, readOnly: false},
          magicType : {show: true, type: ['line', 'bar']},
          restore : {show: true},
          saveAsImage : {show: true}
        }
      },
      calculable : true,
      xAxis : [
      {
        type : 'category',
        boundaryGap : false,
        data : ['周一','周二','周三','周四','周五','周六','周日']
      }
      ],
      yAxis : [
      {
        type : 'value',
        axisLabel : {
          formatter: '{value} °C'
        }
      }
      ],
      series : [
      {
        name:'最高气温',
        type:'line',
        data:[11, 11, 15, 13, 12, 13, 10],
        markPoint : {
          data : [
          {type : 'max', name: '最大值'},
          {type : 'min', name: '最小值'}
          ]
        },
        markLine : {
          data : [
          {type : 'average', name: '平均值'}
          ]
        }
      },
      {
        name:'最低气温',
        type:'line',
        data:[1, -2, 2, 5, 3, 2, 0],
        markPoint : {
          data : [
          {name : '周最低', value : -2, xAxis: 1, yAxis: -1.5}
          ]
        },
        markLine : {
          data : [
          {type : 'average', name : '平均值'}
          ]
        }
      }
      ]
    };

    $self.setOption(option)
  },
  render: function() {
    return (
      <div ref='renderDOMNode' width={this.props.width} height={this.props.height}/>
    );
  }
});

module.exports = BarChart;

// var dbDate = require('../../../utils/CommonFn.js').dbDate
// var mockSongs = require('../../../utils/MockChartData.js')
//
// var classNames = require('classnames')
// var datas = []
// var datas2 = []
// var chart
// function XXX(n) {
//
//   var songs = mockSongs[n].songs
//   var channelData = mockSongs[n].channelData
//
//   while(!!datas2.length){
//     datas2.shift();
//   }
//
//   var LENGTH = channelData.length;
//   while(!!LENGTH){
//     datas2.push(channelData[LENGTH-1])
//     LENGTH--
//   }
//
// };
// XXX(7);
// var configs = {
//   xAxis: {
//     // axisLabel: 'Time (s)',
//     tickFormat: ',.1f',
//     // staggerLabels: true,
//   },
//   yAxis: {
//     // axisLabel: 'Voltage (v)',
//     tickFormat: ',.2f',
//   },
//   options: {
//     transitionDuration: 300,
//     useInteractiveGuideline: false,
//     showLegend: false,
//   }
// }
// var BarChart = React.createClass({
//   getDefaultProps: function() {
//     return {
//       style: {position:"relative", width:"100%", minWidth:"640px", height:"480px", margin: "0px", padding: "0px"}
//     };
//   },
//   getInitialState: function() {
//     return {
//       whichButton: 0
//     };
//   },
//   componentDidMount: function() {
//     var self = this;
//     var config = configs;
//
//     nv.addGraph({
//       generate: function() {
//         var width = nv.utils.windowSize().width,
//         height = nv.utils.windowSize().height;
//         width = Number(width)*89/100
//         height = 480;
//         chart = nv.models.multiBarChart()
//         .width(width)
//         .height(height)
//         .stacked(true)
//         .showControls(false)
//         ;
//         // chart.tooltips(false).showLegend(false)
//         chart.xAxis.tickFormat(function(n){
//           var __ = new Date(n);
//           return dbDate(__.getMonth() + 1) + '/' + dbDate(__.getDate())
//         });
//         chart.yAxis.tickFormat(function(n){return Number.parseInt(n/1000) + 'k'})
//         chart.dispatch.on('renderEnd', function(){
//
//         });
//         var svg = d3.select('#hi2').datum(datas2)
//         svg.transition().duration(0).call(chart);
//
//         return chart;
//       },
//       callback: function(graph) {
//
//         nv.utils.windowResize(function() {
//           var width = nv.utils.windowSize().width;
//           var height = nv.utils.windowSize().height;
//           width = Number(width)*89/100
//           height = 480;
//           graph.width(width)
//           .height(height);
//           d3.select('#hi2')
//           .attr('width', width)
//           .attr('height', height)
//           .transition().duration(0)
//           .call(graph);
//         });
//       }
//     });
//
//   },
//   _changeDate: function(date, whichButton){
//     var self = this
//     return function(){
//       XXX(date)
//       self.setState({
//         whichButton: whichButton
//       });
//       chart.update()
//     }
//   },
//   render: function() {
//     return (
//       <div ref="hi2" style={this.props.style}>
//         <h5 style={{float:"left"}}>
//           {this.props.title}
//         </h5>
//         <div
//           className="btn-group"
//           role="group"
//           aria-label=""
//           style={{float:"right"}}>
//           <button
//             type="button"
//             className={classNames('btn', 'btn-default', this.state.whichButton==0?'active':'')}
//             onClick={this._changeDate(7,0)}>近七天</button>
//           <button
//             type="button"
//             className={classNames('btn', 'btn-default', this.state.whichButton==1?'active':'')}
//             onClick={this._changeDate(14,1)}>近十四天</button>
//           <button
//             type="button"
//             className={classNames('btn', 'btn-default', this.state.whichButton==2?'active':'')}
//             onClick={this._changeDate(30,2)}>近三十天</button>
//         </div>
//         <svg id="hi2">
//         </svg>
//       </div>
//     );
//   }
// });
//
// module.exports = BarChart
