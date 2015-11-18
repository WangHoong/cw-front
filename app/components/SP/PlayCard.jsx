import React from 'react';
import numeral from 'numeral';

class PlayCard extends React.Component {
  constructor() {
    super();
  }

  render() {
    return (
      <div className='sp-total-card trend-down-background'>
        <small>当月消费额</small>
        <h1>{numeral(93821).format('$0,0')}</h1>
        <div className='row'>
          <div className='col-xs-6'>
            <p>总消费额</p>
            <p><strong>{numeral(912721312.80).format('0,0')}</strong></p>
          </div>
          <div className='col-xs-6'>
            <p>上月消费额</p>
            <p><strong>{numeral(9812.80).format('0,0')}</strong></p>
          </div>
        </div>
      </div>
    );
  }
};

export default PlayCard;
