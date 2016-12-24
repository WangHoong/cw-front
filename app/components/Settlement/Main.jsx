"use strict";
var React = require('react');
var Reflux = require('reflux');
var SettlementStore = require('../../stores/SettlementStore');
var SettlementActions = require('../../actions/SettlementActions');
var Role = require('../Common/Role.jsx');
var ListSearch = require('../Common/ListSearch.jsx');


var Main = React.createClass({
  mixins: [Reflux.connect(SettlementStore, 'cp_bills')],

  contextTypes: {
    router: React.PropTypes.func
  },

  componentDidMount: function () {
    let params = ''
    SettlementActions.find(params);
  },
  renderTableHeader: function () {
    return (
      <tr className='tr-th'>
        <th className='one'>序号</th>
        <th className='two'>结算周期</th>
        <th className='three'>结算日期</th>
        <th className='for'>结算金额</th>
        <th className='five'>货币</th>
        <th className='six'>上传时间</th>
        <th className='seven'>操作</th>
      </tr>
    );
  },
  renderTableBody: function () {
    if(this.state.cp_bills instanceof Array){
      return this.state.cp_bills.map((item, key) => {
        return (
          <tr key={key} className='tr-background'>
            <td>{key + 1}</td>
            <td>
              {item.bill_cycle_start ? moment(item.bill_cycle_start).format('YYYY/MM/DD') : '暂无'}&nbsp;- &nbsp;
              {item.bill_cycle_end ? moment(item.bill_cycle_end).format('YYYY/MM/DD') : '暂无'}
            </td>
            <td>{moment(item.created_at).format('YYYY/MM/DD')}</td>
            <td>{item.bill_amount ? item.bill_amount : '暂无'}</td>
            <td>{item.currency.name}</td>
            <td>{moment(item.updated_at).format('YYYY/MM/DD')}</td>
            <td style={{color:'#2ed0d7'}}>
              <a href={item.file_url}>下载</a>
            </td>
          </tr>
        )
      })
    }
  },
  render: function () {
    return (
      <div className='show-wrap topdmc'>
        <div className='t-sb h61'>
          <h3 className='t-sb_detail p-l-20'>数据报表</h3>
        </div>
        <div className='has-top-bar'>
          <div className='row margin0 margin-b-0'>
            <table className='table table-striped table-stripeds margin-b-0'>
              <thead>
                {this.renderTableHeader()}
              </thead>
              <tbody>
                {this.renderTableBody()}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    );
  }
});

module.exports = Main;
