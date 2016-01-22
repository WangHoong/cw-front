import React from 'react';
import Company from './Company.jsx';
import Personal from './Personal.jsx';
import History from './History.jsx';
import axios from 'axios';
import {APIHelper} from '../../utils/APIHelper';
import Loader from '../Common/Loader.jsx';

class Main extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      loaded: false,
      successData: {}
    };
  }

  componentDidMount() {
    axios.all([this.getBankInfo(), this.getStatisticsInfo()]).then(axios.spread((bankInfo, statisticsInfo) => {
      this.setState({
        loaded: true,
        bankInfo: bankInfo.data,
        statisticsInfo: statisticsInfo.data.data
      });
    }));
  }

  getStatisticsInfo() {
    return axios({
      method: 'GET',
      url: APIHelper.getPrefix() + '/statistics',
      responseType: 'json',
      withCredentials: true
    });
  }

  getBankInfo() {
    return axios({
      method: 'GET',
      url: APIHelper.getPrefix() + '/finance/bankinfo',
      responseType: 'json',
      withCredentials: true
    });
  }

  send(data) {
    return axios({
      method: 'POST',
      url: APIHelper.getPrefix() + '/finance/withdraws',
      responseType: 'json',
      data: data,
      withCredentials: true
    });
  }

  setSuccessData(data) {
    this.state.successData = data.data;
    this.setState(this.state);
  }

  renderForm() {
    if (this.state.loaded === false) {
      return <Loader />;
    }
    if (this.state.bankInfo['account_type'] == 1) {
      return <Personal setSuccessData={this.setSuccessData.bind(this)} send={this.send} bankInfo={this.state.bankInfo} statisticsInfo={this.state.statisticsInfo} />;
    }
    if (this.state.bankInfo['account_type'] == 2) {
      return <Company setSuccessData={this.setSuccessData.bind(this)} send={this.send} bankInfo={this.state.bankInfo} statisticsInfo={this.state.statisticsInfo} />;
    }
    return <p>账户类型错误</p>;
  }

  render() {
    return (
      <div className='withdraw-wrap'>
        <h1>提现申请</h1>
        <div className='panel'>
          <div className='panel-body container-fluid'>
            <div className='row'>
              <div className='col-sm-6'>
                {this.renderForm()}
              </div>
              <div className='col-sm-6'>
                <p>提示：</p>
                <p>唱片公司需依据申请金额开具增值税专用发票，收到发票后DMC将及时进行付款。</p>
                <p>独立音乐人所收到版权费为DMC代扣代缴个人所得税及DMC服务费15%后金额。</p>
                <p><strong>增值税专用发票抬头：北京成为科技有限公司</strong></p>
                <p><strong>邮寄地址：北京市朝阳区雅宝路12号华声国际大厦1201</strong></p>
                <p><strong>联系人：蔡润佳</strong></p>
                <p><strong>联系电话：010-59306967</strong></p>
              </div>
            </div>
          </div>
        </div>
        <h1>提现记录</h1>
          <div className='panel'>
            <div className='panel-body container-fluid'>
              <div className='row'>
                <History successData={this.state.successData} />
              </div>
            </div>
          </div>
      </div>
    );
  }
};

export default Main;
