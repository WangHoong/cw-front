import Reflux from 'reflux'
import actions from 'app/actions/ChartActions'
import assign from 'object-assign'


module.exports = Reflux.createStore({
  listenables: [actions],

  init: function () {
    this.chart = {
      option: {}
    };
  },
	
	
	transformData: function (data) {
    let fix = (_) => {
      if(Number(_)<10){
        return '0'+_
      }
      return _
    };
		let year
		let streamCountArr = [],
			downloadCountArr = [],
			dayArr = data.map(function(_){
				streamCountArr.push(_.stream_count);
				downloadCountArr.push(_.download_count);
				return new Date(_.day).toLocaleDateString().split('/').map(fix).slice(0,2).join('/')
			});
			
		return {
      title : {
        text: '歌曲播放总量',
        subtext: '2015'
      },
      tooltip : {
        trigger: 'axis',
      },
      dataZoom : {
        show : true,
        realtime : true,
        start : 75,
        end : 100,
      },
      xAxis : [
      {
        type : 'category',
        boundaryGap : false,
        data : dayArr,
      }
      ],
      yAxis : [
      {
        type : 'value',
        // min: ISPRODMODE ? 0 : 0,
//         max: ISPRODMODE ? 10000 : 100000,
//         splitNumber: ISPRODMODE ? 5 : 5,
      }
      ],
      series : [
      {
        name: '流媒体播放量',
        type: 'line',
        smooth: true,
        symbol: 'emptyCircle',
        itemStyle: {
          normal: {
            areaStyle: {
              type: 'default',
              color: 'RGBA(209, 242, 243, .5)',
            }
          }
        },
        data: streamCountArr,
        markLine : {
          data : [{type : 'average', name : '平均值'}]
        }
      },
      {
        name: '下载量',
        type: 'line',
        smooth: true,
        symbol: 'emptyCircle',
        itemStyle: {
          normal: {
            areaStyle: {
              type: 'default',
              color: 'RGBA(243, 243, 243, .5)',
            },
          },
        },
        data: downloadCountArr,
        markLine: {
          data: [{type : 'average', name : '平均值'}]
        }
      }
      ]
    }
  
	},
	
  getInitialState: function() {
    return this.chart;
  },

  // 根据type获取chart完成回调
  onGetCompleted: function(res) {
    this.updateUI({
      option: this.transformData(res.data.data),
      loaded: true,
    });
  },
	
  updateUI: function(chart) {
		console.log(chart)
    this.trigger(chart);
  }

});
