import React from 'react';
class Process extends React.Component {

  render() {
    let txt
    let a =
    (<div className='card'>
      <h3 style={{marginTop:0}}>请将下列资料通过微信发送至DMC公众账号：</h3>
      <ol>
        <li>独立音乐人本人身份证号</li>
        <li>身份证正面彩色扫描件或数码照片</li>
        <li>手持身份证照片</li>
        <li>本人银行账户（开户行、开户名、账户）</li>
        <li>联系地址、联系电话</li>
      </ol>
    </div>)

    let b =
    (<div className='card'>
      <h3 style={{marginTop:0}}>请将下列资料通过微信发送至DMC公众账号：</h3>
      <ol>
        <li>单位营业执照彩色扫描件或数码照</li>
        <li>组织机构代码证彩色扫描件或数码照片</li>
        <li>对公银行账户（基本户：开户行、开户名、账户）</li>
        <li>法定代表人的身份证彩色扫描件或数码照片</li>
        <li>联系地址、联系电话</li>
      </ol>
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
