var React = require('react');
var PercentCircle = require('app/components/Common/PercentCircle.jsx');
var TopSongs = require('app/components/Common/TopSongs.jsx');
var TopSingers = require('app/components/Common/TopSingers.jsx');
var SongChart = require('../Common/Charts/SongChart.jsx');
var SongChannelChart = require('../Common/Charts/SongChannelChart.jsx');
var TotalCard = require('app/components/Common/TotalCard.jsx');
var TotalCardOfData = require('app/components/Common/TotalCardOfData.jsx');

var Main = React.createClass({
  render: function() {
    var _data=["4/7","6/7","3/7"];
    return (
      <div className='dashboard-container'>
        <div className='row dashboard-header'>
          <div className='col-sm-4'>
            <div className='income'>
              <TotalCard type={'0'} />
            </div>
          </div>
          <div className='col-sm-3'>
            <div className='songsum'>
              <TotalCardOfData />
            </div>
          </div>
          <div className='col-sm-5'>
            <div className='percent'>
              <PercentCircle percent={_data}/>
            </div>
          </div>
        </div>
        <div className='mt20'>
          <div className='row'>
            <div className='col-sm-12'>
              <div className='card'>
                <SongChart />
              </div>
              <div className='card mt20'>
                <SongChannelChart />
              </div>
            </div>
          </div>
        </div>
        <div className='mt20'>
          <div className='row'>
            <div className='col-sm-7'>
              <div className='card'><TopSongs /></div>
            </div>
            <div className='col-sm-5'>
              <div className='card'>
                <TopSingers />
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

});

module.exports = Main;
