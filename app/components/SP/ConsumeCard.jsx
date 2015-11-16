import React from 'react';

class ConsumeCard extends React.Component {
  constructor() {
    super();
  }

  render() {
    return (
      <div className='sp-total-card trend-up-background'>
        <small>当月消费额</small>
        <h1>&yen; 26900</h1>
        <div className='row'>
          <div className='col-xs-6'>
            <p>已入账</p>
            <p><strong>2321.80</strong></p>
          </div>
          <div className='col-xs-6'>
            <p>上月消费额</p>
            <p><strong>23321.80</strong></p>
          </div>
        </div>
      </div>
    );
  }
};

export default ConsumeCard;
