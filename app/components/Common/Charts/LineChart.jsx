var React = require('react');
var LineChart = React.createClass({
  getDefaultProps: function() {
    return {
      style : {
        width : '525px',
        height : '400px',
      },
      option : {
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
      }
    }
  },
  componentDidMount: function() {

    var $self = echarts.init(React.findDOMNode(this.refs.renderDOMNode))

    var option = this.props.option

    $self.setOption(option)

  },
  render: function() {

    var style = this.props.style;

    return (
      <div ref='renderDOMNode' style={style}/>
    );
  }
});

module.exports = LineChart;

// var dbDate = require('app/utils/commonFn.js').dbDate
// var mockSongs = require('app/utils/MockChartData.js')
//
// var classNames = require('classnames')
// var chart, datas = [], datas2 = [];
//
// function XXX(n) {
//   while(!!datas.length){
//     datas.shift()
//   }
//   datas.push({
//     key: "专辑播放总量",
//     values: mockSongs[n].songs,
//     // key: "Fill opacity",
//     color: "#CCF2F3",
//     // fillOpacity: .1
//   })
// };
//
// XXX(7);
//
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
//     isArea: true,
//   }
// }
// var LineChart = React.createClass({
//   getDefaultProps: function() {
//     return {
//       style: {minWidth:"640px", height:"480px", minHeight:"240px", margin: "0px", padding: "0px"}
//     };
//   },
//   getInitialState: function() {
//     return {
//       whichButton: 0
//     };
//   },
//   componentDidMount: function() {
//     var configs = {
//       xAxis: {
//         // axisLabel: 'Time (s)',
//         tickFormat: ',.1f',
//         // staggerLabels: true,
//       },
//       yAxis: {
//         // axisLabel: 'Voltage (v)',
//         tickFormat: ',.2f',
//       },
//       options: {
//         duration: 1000,
//         useInteractiveGuideline: false,
//         showLegend: false,
//         isArea: true,
//       }
//     }
//     var self = this;
//     var config = configs;
//     // nv.addGraph(function() {
//  //
//  //      chart = nv.models.lineChart()
//  //      .options(config.options);
//  //      chart.yDomain([0, 10000]);
//  //      delete config.options;
//  //      for(var  i in config){
//  //        for(var l in config[i]){
//  //          if( /,.2f/.test(config[i][l]) ){
//  //            chart[i][l](function(n){return Number.parseInt(n/1000) + 'k'})
//  //          }else if(/,.1f/.test(config[i][l])){
//  //            chart[i][l](function(n){
//  //              // return d3.time.format('%x')(new Date(n))
//  //              var __ = new Date(n);
//  //              return dbDate(__.getMonth() + 1) + '/' + dbDate(__.getDate())
//  //            })
//  //          }else{
//  //            chart[i][l](config[i][l])
//  //          }
//  //        }
//  //      }
//  //
//  //      d3.select(React.findDOMNode(self.refs.hi)).append('svg')
//  //      .datum(datas)
//  //      .call(chart);
//  //      nv.utils.windowResize(chart.update);
//  //
//  //      return chart;
//  //    });
//
//     var myChart = echarts.init(React.findDOMNode(self.refs.hi));
//
// 		var option = {
// 		    title : {
// 		        text: '专辑播放总量',
// 		        subtext: '纯属虚构'
// 		    },
// 		    tooltip : {
// 		        trigger: 'axis'
// 		    },
// 		    legend: {
// 		        data:['']
// 		    },
// 		    toolbox: {
// 		        show : false,
// 		        feature : {
// 		            mark : {show: true},
// 		            dataView : {show: true, readOnly: false},
// 		            magicType : {show: true, type: ['line', 'bar', 'stack', 'tiled']},
// 		            restore : {show: true},
// 		            saveAsImage : {show: true}
// 		        }
// 		    },
// 		    calculable : true,
// 		    xAxis : [
// 		        {
// 		            type : 'category',
// 		            boundaryGap : false,
// 		            data : ['周一','周二','周三','周四','周五','周六','周日']
// 		        }
// 		    ],
// 		    yAxis : [
// 		        {
// 		            type : 'value'
// 		        }
// 		    ],
// 		    series : [
// 		        // {
// // 		            name:'成交',
// // 		            type:'line',
// // 		            smooth:true,
// // 		            itemStyle: {normal: {areaStyle: {type: 'default'}}},
// // 		            data:[10, 12, 21, 54, 260, 830, 710]
// // 		        },
// // 		        {
// // 		            name:'预购',
// // 		            type:'line',
// // 		            smooth:true,
// // 		            itemStyle: {normal: {areaStyle: {type: 'default'}}},
// // 		            data:[30, 182, 434, 791, 390, 30, 10]
// // 		        },
// 		        {
// 		            name:'意向',
// 		            type:'line',
// 		            smooth:true,
// 		            itemStyle: {normal: {areaStyle: {type: 'default'}}},
// 		            data:[1320, 1132, 601, 234, 120, 90, 20]
// 		        }
// 		    ]
// 		};
//
//     // 为echarts对象加载数据
//     myChart.setOption(option);
// 		setTimeout(function(){myChart.dispose()}, 3000)
//   },
//   _changeDate: function(date, whichButton){
//     var self = this
//     return function(){
//       XXX(date)
//       self.setState({
//         whichButton:  whichButton
//       });
//       chart.update()
//     }
//   },
//   render: function() {
//     // <h6 style={{float:"left"}}>专辑播放总量</h6>
//     return (
//       <div ref="hi" style={{height:"200px",width:"400px;"}}>
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
//             className={classNames('btn btn-default', this.state.whichButton==0?'active':'')}
//             onClick={this._changeDate(7,0)}>近7天</button>
//           <button
//             type="button"
//             className={classNames('btn btn-default', this.state.whichButton==1?'active':'')}
//             onClick={this._changeDate(14,1)}>近14天</button>
//           <button
//             type="button"
//             className={classNames('btn btn-default', this.state.whichButton==2?'active':'')}
//             onClick={this._changeDate(30,2)}>近30天</button>
//         </div>
//       </div>
//     );
//   }
// });
//
// module.exports = LineChart
