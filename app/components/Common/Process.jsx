import React from 'react';
class Process extends React.Component {

  render() {
    let txt
    let style1 = {marginLeft: '230px', width: '140px'}
    let a =
    (<div className='card clearfix'>
      <div style={{float: 'left'}}>
        <h3 style={{marginTop:0}}>请将下列资料通过微信发送至DMC公众账号：</h3>
        <ol>
          <li>1.独立音乐人本人身份证号</li>
          <li>2.身份证正面彩色扫描件或数码照片</li>
          <li>3.手持身份证照片</li>
          <li>4.本人银行账户（开户行、开户名、账户）</li>
          <li>5.联系地址、联系电话</li>
        </ol>
      </div>
      <img style={style1} src={'../images/topdmc.jpg'} alt="TopDMC微信公众号二维码" />
    </div>)

    let b =
    (<div className='card clearfix'>
    <div style={{float: 'left'}}>
      <h3 style={{marginTop:0}}>请将下列资料通过微信发送至DMC公众账号：</h3>
      <ol>
        <li>1.单位营业执照彩色扫描件或数码照</li>
        <li>2.组织机构代码证彩色扫描件或数码照片</li>
        <li>3.对公银行账户（基本户：开户行、开户名、账户）</li>
        <li>4.法定代表人的身份证彩色扫描件或数码照片</li>
        <li>5.联系地址、联系电话</li>
      </ol>
      </div>
      <img style={style1} src={'../images/topdmc.jpg'} alt="TopDMC微信公众号二维码" />
    </div>)

    switch (account_type) {
      case 'personal':
        txt = a
        break;
      case 'company':
        txt = b
        break;
      default:
        txt = (<div></div>)
    }

    return (txt)
  }
}

export default Process;
