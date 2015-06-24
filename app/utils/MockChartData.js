/**
 *
 * Mock Data
 *
 * type: Array
 */

/*
 * rands 计算一组相差不大的随机数
 *
 * @params min 最小值
 * @params max 最大值
 * @params num 个数
 * @return Array
 */
function rands(min, max){
  var watermark = Math.floor((max - min) * 0.65 + min);
  var range_high = Math.round((max - min) * 0.22) + watermark;
  var range_low = Math.floor((min - max) * 0.11) + watermark;
  var r = Math.floor(Math.random() * (range_high - range_low + 1) + range_low);
  // console.debug('wm=' + watermark + ', max=' + range_high + ', min=' + range_low + ', r=' + r);
  return r;
}

// var Immutable = require('immutable');
var clone = require('clone');
var mockSongs;

// 渠道列表
var ChannelArray = [
  '千千静听',
  '网易云音乐',
  '百度云音乐',
  'QQ音乐',
  '酷我音乐',
  'iTunes',
  'Spotify'
];

// 近七天: 7   近十四天: 14   近三十天: 30
var DayNumberArray = [7, 14, 30];

// 生成一次性数据

var RESULT = mockSongs(DayNumberArray, ChannelArray);

function mockSongs(dayNumberArray, channelArray){
  // 模拟 歌曲: songs & 渠道:channelData 数据,
  // 每天 各渠道的总数据之和 等于 歌曲的数据
  var songs = [];
  var channelData = [];

  var _today = new Date();
  // var _date  = _today.getDate();
  // var _month = _today.getMonth()+1;

  var latestX;

  // day = 1000*60*60*24
  var MSDAY = 86400000;
  var __today = +_today;
  var channels;
  var channelsLength;
  var LEN;
  if( arguments[1] ){
    channels = arguments[1].reverse();
    LEN = channelsLength = channels.length;
    while (--channelsLength >= 0) {
      channelData.push({
        key: channels[channelsLength],
        values: []
      });
    }
  }
  // series: latestX, y: ySum*(Math.random()*20/100)
  if( dayNumberArray ){
    latestX = dayNumberArray.slice(-1)[0];

    while ( latestX-- > 0 ){
      // var ySum = Math.round(Math.random() * 10) * 10000;
      var ySum = rands(3e3, 1e4);
      var _SUM = 100;

      songs.push({x: __today, y: ySum });
      channelData.map(function( _, j){
        var __SUM = Math.round(Math.random() * 17);
        _SUM -= __SUM;
        if(++j === LEN){
          _.values.unshift({_x: __today, x: __today, y: ySum * (_SUM / 100)});
        }else{
          _.values.unshift({
            _x: __today,
            x: __today,
            y: ySum * __SUM / 100
          });
        }

      });

      __today -= MSDAY;

    }
  }else{
    var i = 0;

    while ( i++ < 31 ) {
      // var _ySum = Math.round(Math.random() * 10) * 10000;
      var _ySum = rands(3e3, 1e4);
      songs.push({x: i, y: ySum });
      channelData.map(function(_){
        _.values.push({series: latestX, y: _ySum * (Math.random() * 20 / 100)});
      });
    }
  }


  var d7 = clone(channelData);
  d7.forEach(function(_i){return _i.values = _i.values.splice(-7)});

  var d14 = clone(channelData);
  d14.forEach(function(_i){return _i.values = _i.values.splice(-14)});

  return {
    "7": {
      songs: songs.slice(0, 7),
      channelData: d7
    },
    "14": {
      songs: songs.slice(0, 14),
      channelData: d14
    },
    "30": {
      songs: songs,
      channelData: channelData
    }
  };
}

// module.exports = {
//   mockSongs : mockSongs,
// }
module.exports = RESULT;
