function dbDate(_){
  return _ < 10 ? '0'+_ : _
}

/* Inspired by Lee Byron's test data generator. */
function stream_layers(n, m, o) {
  if (arguments.length < 3) o = 0;
  function bump(a) {
    var x = 1 / (.1 + Math.random()),
        y = 2 * Math.random() - .5,
        z = 10 / (.1 + Math.random());
    for (var i = 0; i < m; i++) {
      var w = (i / m - y) * z;
      a[i] += x * Math.exp(-w * w);
    }
  }
  return d3.range(n).map(function() {
      var a = [], i;
      for (i = 0; i < m; i++) a[i] = o + o * Math.random();
      for (i = 0; i < 5; i++) bump(a);
      return a.map(stream_index);
    });
}

/* Another layer generator using gamma distributions. */
function stream_waves(n, m) {
  return d3.range(n).map(function(i) {
    return d3.range(m).map(function(j) {
        var x = 20 * j / m - i / 3;
        return 2 * x * Math.exp(-.5 * x);
      }).map(stream_index);
    });
}

function stream_index(d, i) {
  return {x: i, y: Math.max(0, d)};
}

function transformDataToSDType(data) {
	const splitNumber = 5;
    let fix = (_) => {
      if(Number(_)<10){
        return '0'+_
      }
      return _
    };
		let year
		let streamCountArr = [],
			downloadCountArr = [],
			yMin = 0,
			yMax = 0,
			dayArr = data.map(function(_){
				let sc = Number(_.stream_count);
				yMin = yMin===0 ? sc : (sc < yMin ? sc : yMin);
				// yMin = (yMin+'').split('').reverse();
// 				yMin[0] = '0';
// 				yMin = yMin.reverse().join('');
				yMin = yMin + (yMax-yMin) % splitNumber;
				yMax = sc > yMax ? sc : yMax;
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
        start : 50,
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
        min  : yMin, 
        max	 : yMax,
        splitNumber,
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
  
}

function generateColorLikeBlue(number) {
	number = Number(number)
	return `rgb(${147-number*4}, ${209-number*5}, ${244-number*6})`
}
function transformDataToSPType(data) {
    let fix = (_) => {
      if(Number(_)<10){
        return '0'+_
      }
      return _
    };
		let year
		let streamCountArr = [],
		dayArr = data.map(_ => _.day.split('/').splice(1,2).join('/'));
		
		data = data.map(_ => _.sps);
		let spNameArr = data[0] && data[0].map(_ => _.sp_name);
		let spLen = spNameArr.length;
		data.map( (_) => {
			
			let ii = 0
			while (ii < spLen){
				streamCountArr[ii] = streamCountArr[ii] || [];
				streamCountArr[ii].push(_[ii].stream_count);
				ii++
			};
		})
		let series = spNameArr.map( (_, i) => {
     	return {
        name:_,
        type:'bar',
        stack: '国内',
        symbol: 'emptyCircle',
        data:streamCountArr[i],
        itemStyle: {normal: {color: generateColorLikeBlue(i)}},
      }
		})
			
			
	    return {
	      title : {
	        text: '分渠道播放量',
	        subtext: '2015'
	      },
	      tooltip : {
	        trigger: 'axis',
	        axisPointer : {            // 坐标轴指示器，坐标轴触发有效
	          type : 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
	        }
	      },
	      legend: {
	        //data:['直接访问','邮件营销','联盟广告','视频广告','搜索引擎','百度','谷歌','必应','其他']
	        data: spNameArr,// ['考拉FM', '百度音乐', '荔枝FM', '被窝音乐', '音悦台'],
	        y: 'bottom',
	      },
	      //calculable : true,
	      xAxis : [
	      {
	        type : 'category',
	        boundaryGap : true,
	        data : dayArr,
	      }
	      ],
	      yAxis : [
	      {
	        type : 'value',
	        // min: ISPRODMODE ? 0 : 0,
 // 	        max: ISPRODMODE ? 10000 : 100000,
 // 	        splitNumber: ISPRODMODE ? 5 : 5,
	      }
	      ],
	      markLine:{
	        data:[{type : 'average', name : '平均值'}]
	      },
	      series : series// [
// 	      {
// 	        name:spNameArr[0],
// 	        type:'bar',
// 	        stack: '国内',
// 	        symbol: 'emptyCircle',
// 	        data:streamCountArr[0],
// 	        itemStyle: {normal: {color: '#8BD1DE'}},
// 	      },
// 	      {
// 	        name:spNameArr[1],
// 	        type:'bar',
// 	        stack: '国内',
// 	        symbol: 'emptyCircle',
// 	        data:streamCountArr[1],
// 	        itemStyle: {normal: {color: '#88D1F2'}},
// 	      },
// 	      {
// 	        name:spNameArr[2],
// 	        type:'bar',
// 	        stack: '国内',
// 	        symbol: 'emptyCircle',
// 	        data:streamCountArr[2],
// 	        itemStyle: {normal: {color: '#92BDE1'}},
// 	      }// ,
// 	      {
// 	        name:'被窝音乐',
// 	        type:'bar',
// 	        stack: '国内',
// 	        symbol: 'emptyCircle',
// 	        data:data[3],
// 	        itemStyle: {normal: {color: '#9BAAD2'}},
// 	      },
// 	      {
// 	        name:'音悦台',
// 	        type:'bar',
// 	        stack: '国内',
// 	        symbol: 'emptyCircle',
// 	        data:data[4],
// 	        itemStyle: {normal: {color: '#49BBC4'}},
// 	      }
	      // ]
	    }  
}
module.exports = {
  dbDate,
  stream_layers,
	transformDataToSDType,
	transformDataToSPType,
}
