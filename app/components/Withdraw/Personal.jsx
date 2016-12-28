import React from 'react';

class Personal extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      formData: {
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
    if (isNaN(this.state.formData.money)) {
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
        this.setState({
          recorded: parseInt(this.state.recorded) - parseInt(_data.data.money) || 0
        });
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
    const stateTxt = this.state.sending ? window.lang.withdraw + '...' : window.lang.withdraw;
    return (
      <div>
        <form className='topdmc' onSubmit={this.submit.bind(this)}>
          <div className='form-group'>
            <label className='labelW'>{window.lang.withdraw_an}：</label>{this.props.bankInfo['account_name']}
          </div>
          <div className='form-group'>
            <label className='labelW'>{window.lang.withdraw_bn}：</label>{this.props.bankInfo['bank_name']}
          </div>
          <div className='form-group'>
            <label className='labelW'>{window.lang.withdraw_a}：</label>{this.props.bankInfo['account_number']}
          </div>
          <div className='form-group'>
            <label className='labelW'>{window.lang.withdraw_ar}（&yen; {this.state.recorded}）：</label>
            <input type="text" name='money' className='form-control form_control-w' placeholder='输入申请提现金额' required onChange={this.changeHandle.bind(this)} />
          </div>
          <button type='submit' className='btn btn-primary btn-w-h' disabled={this.state.sending}>{stateTxt}</button>
        </form>
      </div>
    );
  }
};

Personal.propTypes = {
  send: React.PropTypes.func.isRequired,
  bankInfo: React.PropTypes.object.isRequired,
  statisticsInfo: React.PropTypes.object.isRequired
};

export default Personal;
