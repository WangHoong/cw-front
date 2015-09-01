import React, { Component } from 'react'
import BaseChart from './BaseChart.jsx'
import classNames from 'classnames'

const ISPRODMODE = location.hostname==='www.topdmc.com'
class SongChannelChart extends Component {
  constructor(props){
    super(props);
    this.state = {
      whichButton : 30,
      option : this.createOpt(30)
    }
  }
  createOpt(_){
    let date = []
    let baseData = [
      [12000, 12000, 11000, 8000,   6000, 6000,  7000, 5000, 5000, 5000, 8000, 6000, 10000, 10000, 10000, 10000, 7000, 11000, 6000, 2000, 6000, 6000, 4000, 4000, 8000, 2000, 6000, 6000, 4000, 4000],
      [14000, 16000, 12000, 17000, 18000, 26000, 25000, 27000, 24000, 17000, 14000, 25000, 14000, 16000, 16000, 17000, 17000, 15000, 15000, 25000, 24000, 15000, 18000, 17000, 15000, 26000, 13000, 17000, 26000, 19000],
      [12000, 14000, 9000,  10000, 11000, 18000, 15000, 19000, 14000, 11000, 12000, 15000, 10000, 10000, 11000, 11000, 11000, 13000, 11000, 15000, 20000, 11000, 13000, 13000, 13000, 16000, 11000, 11000, 16000, 13000],
      [24000, 24000, 21000, 19000, 24000, 25000, 21000, 25000, 20000, 24000, 24000, 21000, 20000, 19000, 19000, 23000, 23000, 25000, 21000, 21000, 26000, 21000, 25000, 25000, 25000, 22000, 23000, 19000, 22000, 25000],
      [18000, 24000, 17000, 19000, 24000, 25000, 22000, 24000, 27000, 25000, 18000, 23000, 16000, 20000, 21000, 25000, 25000, 19000, 17000, 23000, 24000, 17000, 25000, 26000, 19000, 24000, 17000, 22000, 24000, 26000]
    ]
    // ISPRODMODE && (baseData = [[null],[],[],[],[]])
    ISPRODMODE && (baseData = baseData.map((_)=> _.map(()=>0)))
    let randomArray = arr => {
      return arr.sort(() =>
        Math.random() > 0.5 ? -1 : 1
      )
    }
    let data = baseData.map( (item) =>
      randomArray(item)
    )
    let fix = (_) => {
      if(Number(_)<10){
        return '0'+_
      }
      return _
    };
    ((_) => {
      let today = +new Date()
      let time = 86400000
      while( _ > 0 ){

        let arr = new Date(today).toLocaleDateString().split('/')
        arr = arr.map(fix)
        date.unshift(arr.slice(0,2).join('/'))
        today -= time
        _--
      }
    })(_)
    data = data.map( (item) =>
      item.reverse().slice(0, _).reverse()
    )

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
        data: ['考拉FM', '百度音乐', '荔枝FM', '被窝音乐', '音悦台'],
        y: 'bottom',
      },
      //calculable : true,
      xAxis : [
      {
        type : 'category',
        boundaryGap : true,
        data : date,
      }
      ],
      yAxis : [
      {
        type : 'value',
        min: ISPRODMODE ? 0 : 0,
        max: ISPRODMODE ? 10000 : 100000,
        splitNumber: ISPRODMODE ? 5 : 5,
      }
      ],
      markLine:{
        data:[{type : 'average', name : '平均值'}]
      },
      series : [
      {
        name:'考拉FM',
        type:'bar',
        stack: '国内',
        symbol: 'emptyCircle',
        data:data[0],
        itemStyle: {normal: {color: '#8BD1DE'}},
      },
      {
        name:'百度音乐',
        type:'bar',
        stack: '国内',
        symbol: 'emptyCircle',
        data:data[1],
        itemStyle: {normal: {color: '#88D1F2'}},
      },
      {
        name:'荔枝FM',
        type:'bar',
        stack: '国内',
        symbol: 'emptyCircle',
        data:data[2],
        itemStyle: {normal: {color: '#92BDE1'}},
      },
      {
        name:'被窝音乐',
        type:'bar',
        stack: '国内',
        symbol: 'emptyCircle',
        data:data[3],
        itemStyle: {normal: {color: '#9BAAD2'}},
      },
      {
        name:'音悦台',
        type:'bar',
        stack: '国内',
        symbol: 'emptyCircle',
        data:data[4],
        itemStyle: {normal: {color: '#49BBC4'}},
      }
      ]
    }
  }
  _changeDate(_){
    var result = this.createOpt(_)
    this.setState({
      whichButton: _,
      option: result
    })
  }
  render() {
    let arr = [7, 14, 30]
    let buttons = arr.map((val) =>
      <button key={val} type="button"
      className={classNames('btn btn-default', this.state.whichButton==val?'active':'')}
      onClick={function(){this._changeDate(val)}.bind(this)}
      >近{val}天</button>
    )
    return (
      <div style={{position:'relative',fontFamily: 'Roboto Condensed',fontWeight: 400}}>
        <BaseChart option={this.state.option} style={this.props.style} />
        <div
          className="btn-group"
          role="group"
          aria-label=""
          style={{position:'absolute', top: 0, right: 0}}>
          {buttons}
        </div>
      </div>

    )
  }
}

SongChannelChart.defaultProps = {
  style: {width:'100%',height:'400px'}
}

export default SongChannelChart
