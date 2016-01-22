import React from 'react';
import axios from 'axios';
import {APIHelper} from '../../utils/APIHelper';

class Company extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      formData: {
        express: '',
        express_number: '',
        money: ''
      },
      recorded: this.props.statisticsInfo.amount['recorded_amount'] || 0,
      sending: false
    };
  }
  changeHandle(evt) {
    this.state.formData[evt.target.name] = evt.target.value;
    this.setState(this.state);
  }
  submit(evt) {
    evt.preventDefault();
    if ($.trim(this.state.formData['express']) == '' || $.trim(this.state.formData['express_number']) == '' || isNaN(this.state.formData['money'])) {
      alert('请正确填写信息');
      return;
    }
    this.setState({
      sending: true
    });
    this.props.send(this.state.formData).then((response) => {
      let _data = response.data;
      this.setState({
        sending: false
      });
      if (_data.status === 200) {
        alert('申请成功，您可以在提现历史中查看进度');
        this.state.recorded = parseInt(this.state.recorded) - parseInt(_data.data.money) || 0;
        this.setState(this.state);
        this.props.setSuccessData(_data);
        return;
      }
      if (_data.errorcode === 200100) {
        alert('您已经申请过了，请在提现历史中查看进度');
        return;
      }
      if (_data.errorcode === 200400 || _data.errorcode === 200300) {
        alert(`提现金额不能大于已入账金额，已入账金额为：${this.state.recorded}`);
        return;
      }
      alert(_data.message);
    }).catch((error) => {
      this.setState({
        sending: false
      });
      alert('请求失败，请检查网络是否正常');
    });
  }
  render() {
    const stateTxt = this.state.sending ? '正在提交...' : '提交申请';
    return (
      <div>
        <form onSubmit={this.submit.bind(this)}>
          <div className='form-group'>
            <label>开户名称：</label>{this.props.bankInfo['account_name']}
          </div>
          <div className='form-group'>
            <label>开户行：</label>{this.props.bankInfo['bank_name']}
          </div>
          <div className='form-group'>
            <label>帐号：</label>{this.props.bankInfo['account_number']}
          </div>
          <div className='form-group'>
            <label>快递公司：</label>
            <input type="text" name="express" className='form-control' placeholder='输入寄送发票的快递公司名称' required onChange={this.changeHandle.bind(this)} />
          </div>
          <div className='form-group'>
            <label>快递号：</label>
            <input type="text" name="express_number" className='form-control' placeholder='输入快递单号' required onChange={this.changeHandle.bind(this)} />
          </div>
          <div className='form-group'>
            <label>提现金额（可提现金额为&yen;{this.props.statisticsInfo.amount['recorded_amount']}）：</label>
            <input type="text" name='money' className='form-control' placeholder='输入申请提现金额' required onChange={this.changeHandle.bind(this)} />
          </div>
          <button type='submit' className='btn btn-primary' disabled={this.state.sending}>{stateTxt}</button>
        </form>
      </div>
    );
  }
};

Company.propTypes = {
  send: React.PropTypes.func.isRequired,
  bankInfo: React.PropTypes.object.isRequired,
  statisticsInfo: React.PropTypes.object.isRequired
};

export default Company;