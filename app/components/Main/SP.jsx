import React from 'react';
import AuthorizationHistory from '../SP/AuthorizationHistory.jsx';
import BillingHistory from '../SP/BillingHistory.jsx';
// import PlayCard from '../SP/PlayCard.jsx';
// import ConsumeCard from '../SP/ConsumeCard.jsx';
import {APIHelper} from 'app/utils/APIHelper';
import axios from 'axios';
import AppKey from '../SP/AppKey.jsx';
import TopSongs from '../TopSongs/Main.jsx';

class SP extends React.Component {

  constructor() {
    super();
    // this.state = {
    //   data: null
    // };
  }

  componentDidMount() {
    // axios.get(APIHelper.getPrefix() + '/sp/data_count_total', {withCredentials: true}).then((res) => {
    //   const res_data = res.data;
    //   if (res_data.status === 200) {
    //     this.setState({
    //       data: res_data.data
    //     });
    //   }
    // });
  }

  render() {
    const companyName = window.currentUser.group.SP || {};
    return (
      <div className='sp-container'>
        <div className='card clearfix'>
          <div className='pull-left'>
            <h4>请将下列资料通过微信发送至DMC公众账号：</h4>
            <ol>
              <li>1.音乐人本人身份证号</li>
              <li>2.身份证正面彩色扫描件或数码照片</li>
              <li>3.本人手持身份证照片</li>
              <li>4.本人银行账户（开户行、开户名、账号</li>
              <li>5.联系地址、联系电话</li>
            </ol>
          </div>
          <img style={{marginLeft: '230px', width: '140px'}} src='../images/topdmc.jpg' alt='TopDMC微信公众号二维码' />
        </div>
        <div className='mt10 card'>
          <p className='clearfix'>
            <span className='mr10'><span style={{fontWeight: '400'}}>{window.lang.sp_coName}</span>{companyName.name || ''}</span>
            <span className='mr10'><span style={{fontWeight: '400'}}>APP_KEY：</span><AppKey /></span>
            <span><span style={{fontWeight: '400'}}>{window.lang.sp_doc}</span><a href='http://openapi.topdmc.cn/' target='_blank' className='mr10'>http://openapi.topdmc.cn/</a></span>
          </p>
        </div>
        {/*<div className='row mt10'>
          <div className='col-xs-3'>
            <PlayCard data={this.state.data} />
          </div>
          <div className='col-xs-3'>
            <ConsumeCard data={this.state.data} />
          </div>
        </div>*/}
        <div className='row mt10'>
          <div className='col-xs-6'>
            <AuthorizationHistory />
          </div>
          <div className='col-xs-6'>
            <BillingHistory />
          </div>
        </div>
        <div className='mt10'>
          <TopSongs />
        </div>
      </div>
    );
  }
};

export default SP;
