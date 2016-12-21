import React from 'react'
import Process from 'app/components/Common/Process.jsx'

class ProcessTips extends React.Component {

  // constructor(props){
  //   super(props);
  //   this.state = {
  //     tip: 'hidden'
  //   }
  // }
  //
  // replaceTip() {
  //   this.setState({
  //     tip: 'show'
  //   })
  // }
  // render() {
  //   if (window.status <= 0) {
  //     if (this.state.tip == 'show') {
  //       let company_type = window.currentUser.company_type || 2;
  //       if (company_type == 1) {
  //         return (
  //           <div className='card clearfix'>
  //             <div className='pull-left'>
  //               <h4>请将下列资料通过微信发送至DMC公众账号：</h4>
  //               <ol>
  //                 <li>1.音乐人本人身份证号</li>
  //                 <li>2.身份证正面彩色扫描件或数码照片</li>
  //                 <li>3.本人手持身份证照片</li>
  //                 <li>4.本人银行账户（开户行、开户名、账号）</li>
  //                 <li>5.联系地址、联系电话</li>
  //               </ol>
  //             </div>
  //             <img style={{marginLeft: '230px', width: '140px'}} src='../images/topdmc.jpg' alt='TopDMC微信公众号二维码' />
  //           </div>
  //         );
  //       } else if (company_type == 2) {
  //         return <Process />;
  //       } else {
  //         return <Process />;
  //       }
  //     } else {
  //       return (
  //         <a href='javascript:;' onClick={function() {this.replaceTip()}.bind(this)}>{window.lang.Welcome}</a>
  //       );
  //     }
  //   }
  // }
  render() {
    if (window.is_verified) {
      return (
        <div>
          <p style={{color: '#12bdc4'}}>
            欢迎加入DMC，您提交的信息已经认证通过，系统已为您开放所有功能权限！
          </p>
        </div>
      )
    } else {
      return (
        <div>
          <p style={{color: '#12bdc4'}}>
            欢迎加入DMC！请录入并上传公司与负责人基本信息资料，认证通过即可为您开放所有功能！
            <a className='btn btn-primary' href='/#/info'>
              点击开通
            </a>
          </p>
        </div>
      )
    }
  }
}

export default ProcessTips
