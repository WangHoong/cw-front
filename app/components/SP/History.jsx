import React from 'react';
import axios from 'axios';
import {APIHelper} from 'app/utils/APIHelper';

class History extends React.Component {

  constructor() {
    super();
    this.state = {
      loaded: false
    };
  }

  componentDidMount() {
    axios.get(APIHelper.getPrefix() + '/authorization').then((res) => {
      const res_data = res.data;
      if (res_data.status === 200) {
        this.setState({
          loaded: true,
          data: res_data
        });
      }
    });
  }

  renderList() {
    if (!this.state.loaded) {
      return (
        <span />
      );
    }
    let items = this.state.data.data.replies.map((item, idx) => {
      return (
        <tr key={idx}>
          <td>{item.company.name}</td>
          <td>{item.status === 1 ? '已授权' : '未通过'}</td>
          <td>{item.created_at}</td>
        </tr>
      );
    });
    return (
      <tbody>
        {items}
      </tbody>
    );
  }

  render() {
    return (
      <table className='table'>
        <thead>
          <tr>
            <th>唱片公司</th>
            <th>状态</th>
            <th>订购日期</th>
          </tr>
        </thead>
        {this.renderList()}
      </table>
    );
  }

};

export default History;
