import React from 'react';
import AuthorizationHistory from '../SP/AuthorizationHistory.jsx';
import BillingHistory from '../SP/BillingHistory.jsx';
import PlayCard from '../SP/PlayCard.jsx';
import ConsumeCard from '../SP/ConsumeCard.jsx';

class SP extends React.Component {
  render() {
    return (
      <div className='sp-container'>
        <div className='row'>
          <div className='col-xs-3'>
            <PlayCard />
          </div>
          <div className='col-xs-3'>
            <ConsumeCard />
          </div>
        </div>
        <div className='row mt10'>
          <div className='col-xs-7'>
            <AuthorizationHistory />
          </div>
          <div className='col-xs-5'>
            <BillingHistory />
          </div>
        </div>
      </div>
    );
  }
};

export default SP;
