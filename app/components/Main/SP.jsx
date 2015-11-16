import React from 'react';
import AuthorizationHistory from '../SP/AuthorizationHistory.jsx';
import BillingHistory from '../SP/BillingHistory.jsx';
import PlayCard from '../SP/PlayCard.jsx';
import ConsumeCard from '../SP/ConsumeCard.jsx';
import {APIHelper} from 'app/utils/APIHelper';
import axios from 'axios';
import AppKey from '../SP/AppKey.jsx';

class SP extends React.Component {

  constructor() {
    super();
    this.state = {
      data: null
    };
  }

  componentDidMount() {
    axios.get(APIHelper.getPrefix() + '/sp/data_count_total', {withCredentials: true}).then((res) => {
      const res_data = res.data;
      if (res_data.status === 200) {
        this.setState({
          data: res_data.data
        });
      }
    });
  }

  render() {
    return (
      <div className='sp-container'>
        <div>开发者文档：<a href='http://openapi.topdmc.cn/' target='_blank' className='mr10'>http://openapi.topdmc.cn/</a>APP_KEY：<AppKey /></div>
        <div className='row mt10'>
          <div className='col-xs-3'>
            <PlayCard data={this.state.data} />
          </div>
          <div className='col-xs-3'>
            <ConsumeCard data={this.state.data} />
          </div>
        </div>
        <div className='row mt10'>
          <div className='col-xs-6'>
            <AuthorizationHistory />
          </div>
          <div className='col-xs-6'>
            <BillingHistory />
          </div>
        </div>
      </div>
    );
  }
};

export default SP;
