import React from 'react';
import AuthorizationHistory from '../SP/AuthorizationHistory.jsx';
import BillingHistory from '../SP/BillingHistory.jsx';

class SP extends React.Component {
  render() {
    return (
      <div className='sp-container'>
        <div className='row'>
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
