
import React, { Component } from 'react'

var Reflux = require('reflux');
var UserInfoStore = require('../../stores/UserInfoStore');
var UserInfoActions = require('../../actions/UserInfoActions');
var ProcessTips = require('app/components/Common/ProcessTips.jsx');
class Item extends Component {
  render() {
    const { label, desc } = this.props
    return (
      <div className="row" >
        <label className="col-xs-2 text-right" >{label}</label>
        <div className="col-xs-6">
          <p>{desc}</p>
        </div>
      </div>
    )
  }
}
var Info = React.createClass({

  mixins: [Reflux.connect(UserInfoStore, 'userInfo')],

  contextTypes: {
    router: React.PropTypes.func
  },

  componentDidMount: function () {
    UserInfoActions.get()
  },

  render: function() {
    const {
    	representative,
    	company_type,
    	ID_card,
    	bank_name,
    	account_number,
    	phone,
    	email,
    	address,
    	id_card_img,
    	id_card_second_img,
    	handle_img,
    	account_name
    } = this.state.userInfo
    let msg = (
      <span style={{marginLeft: '20px', color: '#FFA39E'}}>
        基本信息正在审核中，我们将在4-5个工作日内通知您审核结果！
      </span>
    )
    if (representative === '') {
      this.context.router.transitionTo('edit')
      return (
        <div></div>
      )
    } else if (representative === undefined) {
      return (
        <div></div>
      )
    } else {
      return (
        <div>
          <div className='card' style={{fontSize: '14px'}}>
            <h4 style={{display: 'inline'}}>公司基本资料详情</h4>
            {is_verified ? null : msg}
          </div>
          <div className='card mt20'>
            <Item label={'版权方：'} desc={window.currentUser.company.name}/>
            <Item label={'入驻身份：'} desc={company_type==1?'个人':'公司'}/>
          </div>
          <div className='card mt20' >
            <div>{company_type==1 ? '负责人基本信息' : '公司基本信息'}</div>
            <Item label={company_type==1 ? '申请人：' : '法人信息：'} desc={representative}/>
            <Item label={'证件号：'} desc={ID_card}/>
            <Item label={'联系电话：'} desc={phone}/>
            <Item label={'常用邮箱：'} desc={email}/>
            <Item label={'联系地址：'} desc={address}/>
          </div>
          <div className='card mt20'>
            <div>{company_type==1 ? '开户信息' : '公司开户信息'}</div>
            <Item label={'开户行名称：'} desc={bank_name}/>
            <Item label={'开户名称：'} desc={account_name}/>
            <Item label={'开户行账号：'} desc={account_number}/>
          </div>
        </div>
      )
    }
  }
})
export default Info
