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

  renderDesc() {
    var isGlobal = window.location.hostname.indexOf('global') != -1 ? true : false
    if (isGlobal) {
      return (
        <div className='col-sm-6'>
          <p>
            Step 1: When you would like to withdraw money from your account, please click the ‘withdraw’ button then the system will automatically send the application to DMC.
            <br />
            <br />
            Step 2: DMC will calculate the corresponding tax fee and actual payment after receiving your application, and then DMC will inform you above number by email.
            <br />
            <br />
            Step 3: You need to make an invoice to DMC according to the number of tax fee and actual payment you got from DMC.
            <br />
            <br />
            Step 4: Once DMC get the invoice from you, DMC will transfer the payment to you via Paypal.
          </p>
        </div>
      )
    }
    return (
      <div className='col-sm-6'>
        <p>提示：</p>
        <p className='mt10'>法人公司需依据申请提现金额开具增值税专用发票，并邮寄至北京成为科技；</p>
        <p>收到发票并复核后DMC将及时进行付款。</p>
        <p className='mt10'><strong>成为科技开票信息</strong></p>
        <p><strong>公司名称：北京成为科技有限公司</strong></p>
        <p><strong>税务登记证号：110105330365782</strong></p>
        <p><strong>注册地址及联系电话：北京市朝阳区工人体育场北路21号楼11层1单元1103室 01059306967</strong></p>
        <p className='mt10'>开户行名称：华夏银行股份有限公司北京朝阳门支行</p>
        <p className='mt10'>开户行账号：10254000000498574</p>
        <p>行号：304100042933</p>
      </div>
    )
  }

  render() {
    return (
      <div className='withdraw-wrap'>
        <h1>{window.lang.withdraw_title}</h1>
        <div className='panel'>
          <div className='panel-body container-fluid'>
            <div className='row'>
              <div className='col-sm-6'>
                {this.renderForm()}
              </div>
              {this.renderDesc()}
            </div>
          </div>
        </div>
        <h1>{window.lang.withdraw_ra}</h1>
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
