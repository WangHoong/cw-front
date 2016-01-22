import React from 'react';
import axios from 'axios';
import {APIHelper} from '../../utils/APIHelper';
import Loader from '../Common/Loader.jsx';

const status_tips = ['待审核', '审核通过', '审核失败'];

class History extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      loaded: false,
      data: {
        items: []
      }
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

  getHistory() {
    return axios({
      method: 'GET',
      url: APIHelper.getPrefix() + '/finance/withdraws',
      responseType: 'json',
      withCredentials: true
    });
  }

  renderList() {
    if (!this.state.loaded) {
      return <Loader />;
    }
    if (this.state.data.items.length <= 0) {
      return <p className='text-center'>暂无记录</p>;
    }
    let items = this.state.data.items.map((item, idx) => {
      return (
        <tr key={idx}>
          <td>{item.bank_name}</td>
          <td>{item.account_name}</td>
          <td>{item.account_number}</td>
          <td>{status_tips[item.status]}</td>
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
