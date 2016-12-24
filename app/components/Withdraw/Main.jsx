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
            Step 1: When you would like to withdraw money from your account, please click the ‘withdraw’ button then the system will automatically sending the application to DMC.
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
      <div className='show-wrap topdmc'>
        <div className='t-sb h61'>
          <h3 className='t-sb_detail p-l-20'>{window.lang.withdraw_title}</h3>
        </div>
        <div className='has-top-bar'>
          <div className='card margin0 border'>
            <div className='row margin0'>
              {/* <div className='col-sm-6'> */}
                {this.renderForm()}
              {/* </div> */}
              {/* {this.renderDesc()} */}
            </div>
          </div>
          <div className='card margin0 border mt20'>
            <div className='row margin0 margin-b-0'>
              <div className='table-title p-b-20'>提现记录</div>
              <History successData={this.state.successData} />
            </div>
          </div>
        </div>
        {/* <div className='withdraw-wrap'>
          <h1>{window.lang.withdraw_ra}</h1>
            <div className='panel'>
              <div className='panel-body container-fluid'>
                <div className='row'>

                </div>
              </div>
            </div>
        </div> */}
      </div>
    );
  }
};

export default Main;
