import React from 'react';
import axios from 'axios';
import Loader from '../Common/Loader.jsx';
import {APIHelper} from 'app/utils/APIHelper';
import classNames from 'classnames';

class AuthorizationHistory extends React.Component {

  constructor() {
    super();
    this.state = {
      loaded: false,
      res_data: {
        data: null
      },
      contentShow: true
    };
  }

  renderTableHeader() {
    return (
      <thead>
        <tr>
          <th style={{width: '50%'}}>音乐供应商</th>
          <th style={{width: '20%'}}>状态</th>
          <th>授权日期</th>
        </tr>
      </thead>
    );
  }

  componentDidMount() {
    axios.get(APIHelper.getPrefix() + '/authorization', {withCredentials: true}).then((res) => {
      const res_data = res.data;
      if (res_data.status === 200) {
        this.setState({
          loaded: true,
          res_data: res_data
        });
      }
    }).catch((err) => {
      this.setState({
        loaded: true
      });
    });
  }

  renderList() {
    if (!this.state.loaded) {
      return (
        <tbody>
          <tr>
            <td align='center' colSpan='3'>
              <Loader />
            </td>
          </tr>
        </tbody>
      );
    }
    if (!this.state.res_data.data) {
      return (
        <tbody>
          <tr>
            <td align='center' colSpan='3' className='text-center'>
              请求异常
            </td>
          </tr>
        </tbody>
      );
    }
    if (this.state.res_data.data.replies.length <= 0) {
      return (
        <tbody>
          <tr>
            <td align='center' colSpan='3' className='text-center'>
              暂无相关信息
            </td>
          </tr>
        </tbody>
      );
    }
    let items = [];
    this.state.res_data.data.replies.map((item, idx) => {
      const trClass = classNames({
        'text-success': item.status === 1
      });
      const iconClass = classNames('fa', 'mr10', {
        'fa-link': item.status === 1,
        'fa-unlink': item.status !== 1
      });
      items.push(
        <tr key={idx} className={trClass}>
          <td>{item.company.name}</td>
          <td><i className={iconClass} />{item.status === 1 ? '已授权' : '未通过'}</td>
          <td>{item.created_at ? moment(item.created_at).format('YYYY-MM-DD') : '--'}</td>
        </tr>
      );
    });
    return (
      <tbody>
        {items}
      </tbody>
    );
  }

  renderPrimaryInfo() {
    if (!this.state.loaded) {
      return;
    }
    const _data = this.state.res_data.data;
    return (
      <div className='row mb10'>
        <div className='col-xs-6'>申请日期：{_data.created_at ? moment(_data.created_at).format('YYYY-MM-DD') : ''}</div>
        <div className='col-xs-6'>价格：{_data.price}{window.lang.rmb}/1000{window.lang.times}</div>
      </div>
    );
  }

  toggle() {
    const contentElement = React.findDOMNode(this.refs.content);
    if (this.state.contentShow) {
      $(contentElement).slideUp(200);
    } else {
      $(contentElement).slideDown(200);
    }
    this.setState({
      contentShow: !this.state.contentShow
    });
  }

  render() {
    const ctrlClass = classNames('fa', {
      'fa-chevron-up': this.state.contentShow,
      'fa-chevron-down': !this.state.contentShow
    });
    return (
      <div className='m-ibox'>
        <div className='m-ibox-header'>
          <div className='tools'>
            <a onClick={() => {this.toggle()}}><i className={ctrlClass} /></a>
          </div>
          <h5>授权记录</h5>
        </div>
        <div className='m-ibox-content' ref='content'>
          {this.renderPrimaryInfo()}
          <table className='table table-hover'>
            {this.renderTableHeader()}
            {this.renderList()}
          </table>
        </div>
      </div>
    );
  }

};

export default AuthorizationHistory;
