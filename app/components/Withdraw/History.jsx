import React from 'react';
import axios from 'axios';
import {APIHelper} from '../../utils/APIHelper';
import Loader from '../Common/Loader.jsx';
import classNames from 'classnames';

const status_tips = ['审核中', '审核通过', '审核失败', '付款成功'];

class History extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      loaded: false,
      data: {
        items: []
      },
      isShowTip: false
    };
  }

  componentDidMount() {
    this.getHistory().then((response) => {
      this.setState({
        data: response.data.data,
        loaded: true
      });
    });
  }

  componentWillReceiveProps(nextProps) {
    if (!$.isEmptyObject(nextProps.successData)) {
      this.state.data.items.unshift(nextProps.successData);
      this.setState(this.state);
    }
  }

  getHistory() {
    return axios({
      method: 'GET',
      url: APIHelper.getPrefix() + '/finance/withdraws',
      responseType: 'json',
      withCredentials: true
    });
  }

  toggleTip() {
    this.state.isShowTip = !this.state.isShowTip;
    this.setState(this.state);
  }

  renderTip(item) {
    if (item.status == 2) {
      let _style = this.state.isShowTip ? {display: 'block'} : {display: 'none'}
      return (
        <span className='wd-f-tip'>
          <i className='fa fa-info text-danger' onMouseOver={this.toggleTip.bind(this)} onMouseOut={this.toggleTip.bind(this)}></i>
          <span style={_style} className='t-i'>{item.desc}</span>
        </span>
      );
    } else {
      return '';
    }
  }

  renderList() {
    if (!this.state.loaded) {
      return <Loader />;
    }
    if (this.state.data.items.length <= 0) {
      return <p className='text-center'>{window.lang.withdraw_none}</p>;
    }
    let items = this.state.data.items.map((item, idx) => {
      return (
        <tr key={idx}>
          <td>{item.bank_name}</td>
          <td>{item.account_name}</td>
          <td>{item.account_number}</td>
          <td>
            <span>{status_tips[item.status]}</span>
            {this.renderTip(item)}
          </td>
          <td>&yen;{item.money}</td>
          <td>{moment(item.created_at).format('ll')}</td>
        </tr>
      );
    });
    return (
      <table className='table table-striped'>
        <thead>
          <tr>
            <th>银行名称</th>
            <th>开户名</th>
            <th>账号</th>
            <th>提现状态</th>
            <th>提现金额</th>
            <th>申请日期</th>
          </tr>
        </thead>
        <tbody>
          {items}
        </tbody>
      </table>
    );
  }

  render() {
    return this.renderList();
  }
};

export default History;
