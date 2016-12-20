import React, { Component } from 'react'
var UpAvatar = require('../Common/UpAvatar.jsx');

var Reflux = require('reflux');
var UserInfoStore = require('../../stores/UserInfoStore');
var UserInfoActions = require('../../actions/UserInfoActions');
require('bootstrap-validator')
var Edit = React.createClass({

  mixins: [Reflux.connect(UserInfoStore, 'userInfo')],

  contextTypes: {
    router: React.PropTypes.func
  },

  getInitialState () {
    return {
      company_type: '2'
    };
  },

  componentDidMount: function () {
    if (is_verified) {
      this.context.router.transitionTo('info')
    }
  },

  handleChange(e) {
    this.state[e.target.name] = e.target.value;
    this.setState(this.state);
  },

  handleChangeAccount(e) {
    if (e.target.value.length < (this.state[e.target.name] ? this.state[e.target.name].length : 0)) {
      this.state[e.target.name] = e.target.value
    } else {
      this.state[e.target.name] = e.target.value.replace(/(\d{4})\s*/g, '$1 ')
    }
    this.setState(this.state)
  },

  toggleCompanyType(company_type) {
    this.state.company_type = company_type
    this.setState(this.state)
  },
  handlePhotoUploaded(type) {
    var photo = this.refs[type].getValue();
    this.state[type] = photo.src;
    // this.state[`${type}_resource_id`] = photo.resource_id;
    this.setState(this.state);
  },
  render() {
    if (this.state.userInfo.status=='ok') {
      this.context.router.transitionTo('info')
    }
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
      license_img,
    	account_name
    } = this.state
    const representativeName = company_type==1 ? '申请人' : '法人代表'
    const ID_cardName = company_type==1 ? '证件号' : '营业执照号'
    const pstyles = company_type == '1' ? {backgroundColor: '#98CC6D', width: '80px'} : {width: '80px'}
    const cstyles = company_type != '1' ? {backgroundColor: '#98CC6D', width: '80px'} : {width: '80px'}
    const tips = company_type=='1'
      ? '请上传手持身份证正面照，身份证正面照，身份证反面照。'
      : '请上传营业执照照片，法人身份证手持正面照片，法人身份证反面照片。'
    return (
      <form data-toggle="validator" role="form" id='InfoEdit'>
        <div className='card'>
          <h4 style={{display: 'inline'}}>基本资料编辑</h4>
        </div>
        <div className='card mt20'>
          <div className="form-group row" style={{fontSize: '14px'}}>
            <label for="account_number" className="col-xs-2 col-form-label text-right" style={{marginTop: '7px'}}>版权方：</label>
            <div className="col-xs-6">
              <p className="form-control-static">{window.currentUser.company.name}</p>
            </div>
          </div>
          <div className="form-group row" style={{fontSize: '14px', marginBottom: 0}}>
            <label for="account_number" className="col-xs-2 col-form-label text-right" style={{marginTop: '8px'}}>入驻身份：</label>
            <div className="col-xs-6">
              <div className="btn-group" role="group">
                <button type="button" className="btn btn-default" style={cstyles} onClick={()=>this.toggleCompanyType('2')}>公司</button>
                <button type="button" className="btn btn-default" style={pstyles} onClick={()=>this.toggleCompanyType('1')}>个人</button>
              </div>
              <span className="help-block mt10">注：入驻身份确认提交一次后不可再进行修改。</span>
            </div>
          </div>
        </div>
        <div className='card mt20'>
          <div>{company_type==1 ? '负责人基本信息' : '公司基本信息'}</div>
          <div className="form-group row" style={{fontSize: '14px'}}>
            <label for="representative" className="col-xs-2 col-form-label text-right" style={{marginTop: '8px'}}>{representativeName}：</label>
            <div className="col-xs-6">
              <input name='representative' className="form-control" type="text" value={representative} id="representative" onChange={this.handleChange}
                placeholder={`请输入${representativeName}名称`}
                data-error='不能为空'
                required
              />
            </div>
          </div>
          <div className="form-group row" style={{fontSize: '14px'}}>
            <label for="ID_card" className="col-xs-2 col-form-label text-right" style={{marginTop: '8px'}}>{ID_cardName}：</label>
            <div className="col-xs-6">
              <input name='ID_card' className="form-control" type="text" value={ID_card} id="ID_card" onChange={this.handleChange}
                placeholder={`请输入${ID_cardName}`}
                data-error='不能为空'
                required
              />
            </div>
          </div>
          <div className="form-group row" style={{fontSize: '14px'}}>
            <label for="phone" className="col-xs-2 col-form-label text-right" style={{marginTop: '8px'}}>联系电话：</label>
            <div className="col-xs-6">
              <input name='phone' className="form-control" type="text" value={phone} id="phone" onChange={this.handleChange}
                placeholder='请输入联系电话'
                data-error='不能为空'
                required
              />
            </div>
          </div>
          <div className="form-group row" style={{fontSize: '14px'}}>
            <label for="email" className="col-xs-2 col-form-label text-right" style={{marginTop: '8px'}}>常用邮箱：</label>
            <div className="col-xs-6">
              <input name='email' className="form-control" type="email" value={email} id="email" onChange={this.handleChange}
                placeholder='请输入常用邮箱'
                data-error='请输入正确的邮箱格式'
                required
              />
              <div className="help-block with-errors"></div>
            </div>
          </div>
          <div className="form-group row" style={{fontSize: '14px'}}>
            <label for="address" className="col-xs-2 col-form-label text-right" style={{marginTop: '8px'}}>联系地址：</label>
            <div className="col-xs-6">
              <input name='address' className="form-control" type="text" value={address} id="address" onChange={this.handleChange}
                placeholder='请输入联系地址'
                data-error='不能为空'
                required
              />
            </div>
          </div>
        </div>
        <div className='card mt20'>
          <div>{company_type==1 ? '开户信息' : '公司开户信息'}</div>
          <div className="form-group row" style={{fontSize: '14px'}}>
            <label for="bank_name" className="col-xs-2 col-form-label text-right" style={{marginTop: '8px'}}>开户行名称：</label>
            <div className="col-xs-6">
              <input name='bank_name' className="form-control" type="text" value={bank_name} id="bank_name" onChange={this.handleChange}
                placeholder='请输入开户行名称'
                data-error='不能为空'
                required
              />
            </div>
          </div>
          <div className="form-group row" style={{fontSize: '14px'}}>
            <label for="account_name" className="col-xs-2 col-form-label text-right" style={{marginTop: '8px'}}>开户名称：</label>
            <div className="col-xs-6">
              <input name='account_name' className="form-control" type="text" value={account_name} id="account_name" onChange={this.handleChange}
                placeholder={window.currentUser.company.name}
                required
              />
              <span className="help-block mt10" style={{marginBottom: '-8px'}}>注：根据相关法律规定开户名称与版权方必须一致。</span>
              <div class="help-block with-errors"></div>
            </div>
          </div>
          <div className="form-group row" style={{fontSize: '14px'}}>
            <label for="account_number" className="col-xs-2 col-form-label text-right" style={{marginTop: '8px'}}>开户行账号：</label>
            <div className="col-xs-6">
              <input name='account_number' className="form-control" type="text" value={account_number} id="account_number" onChange={this.handleChangeAccount}
                placeholder='请输入开户行账号'
                data-error='不能为空'
                required
              />
            </div>
          </div>
        </div>
        <div className='card mt20'>
          <div>版权认证</div>
          <div className='row' style={{margin: '10px 30px 10px 50px'}}>
            <div className='col-md-4'>
              <UpAvatar
                tips={company_type=='1' ? '上传手持身份证正面照' : '上传营业执照照片'}
                src={company_type=='1' ? handle_img : license_img}
                ref={company_type=='1' ? 'handle_img' : 'license_img'}
                type='company_photo'
                uploadComplete={() => this.handlePhotoUploaded(`${company_type=='1' ? 'handle_img' : 'license_img'}`)}
              />
            </div>
            <div className='col-md-4'>
              <UpAvatar
                tips={company_type=='1' ? '上传身份证正面照' : '上传法人身份证手持正面照片'}
                src={id_card_img}
                ref='id_card_img'
                type='company_photo'
                uploadComplete={() => this.handlePhotoUploaded('id_card_img')}
              />
            </div>
            <div className='col-md-4'>
              <UpAvatar
                tips={company_type=='1' ? '上传身份证反面照' : '上传法人身份证反面照片'}
                src={id_card_second_img}
                ref='id_card_second_img'
                type='company_photo'
                uploadComplete={() => this.handlePhotoUploaded('id_card_second_img')}
              />
            </div>
          </div>
          <p className="text-center" style={{color: '#a94442'}}>{this.state.imgErr ? tips : ''}</p>
        </div>
        <div style={{margin: '10px auto', width: '200px'}}>
          <button type="submit" className="btn btn-default btn-primary"
            style={{marginRight: '20px', width: '90px'}}
            onClick={(e)=>{
              var info = this.state
              var that = this
              $('#InfoEdit').validator().on('submit', function (e) {
                if (!(that.state.id_card_img && that.state.id_card_second_img && (that.state.handle_img || that.state.license_img))) {
                  that.state.imgErr = true
                  that.setState(that.state)
                }else{
                  that.state.imgErr = false
                  that.setState(that.state)
                }
                if (e.isDefaultPrevented()) {
                  // TODO
                } else {
                  e.preventDefault()
                  UserInfoActions.update(that.state)
                }
              })
            }}
            >提交</button>
            <button type="button" className="btn btn-default"
              style={{width: '90px'}}
              onClick={()=>{
                this.context.router.transitionTo('base')
              }}
              >取消</button>
        </div>
      </form>
    )
  }
})

export default Edit
