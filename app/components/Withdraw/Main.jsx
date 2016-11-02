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
          <p>Please Note</p>
          <p>
            How to WITHDRAW the revenue:
            <br />
            Applying withdraw online-----à sending invoice to gai@topdmc.com -----à get the payment via Paypal
            <br />
            About the INVOICE:
            <br />
            The Title of Company: TopDMC
            <br />
            Company Address: Room 1201, HuaSheng International Building, No. 12 Yabao Road, Chaoyang District, Beijing, China
            <br />
            Contact person: Ms. Cai Runjia
            <br />
            Tel: +86 10 59306967
            <br />
            About the TAX:
            <br />
            Both Individual musician and Record company should pay the relate tax as to the Chinese policy of income and tax. Please see the details as follow:
            <br />
            FOR INDIVIDUAL MUSICIAN:
            <br />
            The tax is for royalties and licence fees, usually refer to using intangible property such as right, information and service. The number of tax rate in terms of the actual income at the accounting day.
            <br />
            {'* <RMB800: NO NEED TO PAY TAX'}
            <br />
            {'* RMB800-RMB4,000: (ACTUAL IMCOME-RMB800)*20%'}
            <br />
            * >RMB4000: ACTUAL IMCOME*80%*20%
            <br />
            ** In order to protect the production cost, Chinese policy define that the production cost is RMB800 if the actual income is less than RMB4,000 but more than RMB800. What's more, if the actual income is more than RMB4,000, the production cost define to be account for 20% of the income, then the balance needs to pay the tax fee.
            <br />
            Once tax paid, a Tax Clearance Certificate will be provided.
            <br />
            FOR RECORD LABEL COMPANY:
            <br />
            The tax is 'value-added tax', should be paid as ACTUAL INCOME*6%*12%
          </p>
        </div>
      )
    }
    return (
      <div className='col-sm-6'>
        <p>提示：</p>
        <p className='mt10'>法人公司需依据申请提现金额开具增值税专用发票，并邮寄至北京成为科技；</p>
        <p>收到发票并复核后DMC将及时进行付款。</p>
        <p className='mt10'><strong>增值税专用发票抬头：北京成为科技有限公司</strong></p>
        <p><strong>邮寄地址：北京市朝阳区雅宝路12号华声国际大厦1201</strong></p>
        <p><strong>联系人：蔡润佳</strong></p>
        <p><strong>联系电话：010-59306967</strong></p>
        <p className='mt10'>独立音乐人收到的金额为申请提现金额扣除DMC代扣代缴个人所得税后的金额（个人所得税纳税标准按国家规定进行扣除）</p>
        <p className='mt10'>由于现财务转账需要操作时间，故上周五至本周四的提现申请将在本周五统一进行汇款。本周五至下周四的提现申请将在下周五统一进行汇款。</p>
        <p>请仔细复核您的账户信息，如有疑问可联系微信公众账号。</p>
      </div>
    )
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
              {this.renderDesc()}
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
