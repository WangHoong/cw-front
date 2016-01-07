import React from 'react';
import axios from 'axios';
import Loader from '../Common/Loader.jsx';
import {APIHelper} from 'app/utils/APIHelper';
import classNames from 'classnames';
import numeral from 'numeral';

class BillingHistory extends React.Component {

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
          <th style={{width: '25%'}}>{window.lang.sp_da}</th>
          <th style={{width: '25%'}}>{window.lang.sp_dl}</th>
          <th style={{width: '25%'}}>{window.lang.sp_str}</th>
          <th>{window.lang.sp_tp}</th>
        </tr>
      </thead>
    );
  }

  componentDidMount() {
    axios.get(APIHelper.getPrefix() + '/sp/data_count_month', {withCredentials: true}).then((res) => {
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
            <td align='center' colSpan='4'>
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
            <td align='center' colSpan='4' className='text-center'>
              {window.lang.sp_reqErr}
            </td>
          </tr>
        </tbody>
      );
    }
    if (this.state.res_data.data.length <= 0) {
      return (
        <tbody>
          <tr>
            <td align='center' colSpan='4' className='text-center'>
              {window.lang.sp_nodata}
            </td>
          </tr>
        </tbody>
      );
    }
    let items = [];
    this.state.res_data.data.map((item, idx) => {
      items.push(
        <tr key={idx}>
          <td>{item.year + '年' + item.month + '月'}</td>
          <td>{numeral(item.download_count).format('0,0')}</td>
          <td>{numeral(item.stream_count).format('0,0')}</td>
          <td>{numeral(item.price).format('$0,0.00')}</td>
        </tr>
      );
    });
    return (
      <tbody>
        {items}
      </tbody>
    );
  }

  toggle() {
    const contentElement = this._content;
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
          <h5>{window.lang.sp_tr}</h5>
        </div>
        <div className='m-ibox-content' ref={ _ => this._content = _ }>
          <table className='table table-hover'>
            {this.renderTableHeader()}
            {this.renderList()}
          </table>
        </div>
      </div>
    );
  }

};

export default BillingHistory;
