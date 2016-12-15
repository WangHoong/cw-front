import React from 'react';
class Process extends React.Component {

  render() {
    let txt
    let style1 = {marginRight: '100px', width: '140px', float: 'right'}
    let img = !/global\.topdmc\.com/.test(location.host) ? (<img style={style1} src={'../images/topdmc.jpg'} alt="TopDMC微信公众号二维码" />) : ''
    let a =
    (<div className='card clearfix p-b-0 p-t-0'>
      <div style={{float: 'left'}}>
        <h3 style={{marginTop:0}} className='send'>{window.lang.Please}{window.lang.Please1}</h3>
        <ol className='verify'>
          <li>{window.lang.P1}</li>
          <li>{window.lang.P2}</li>
          <li>{window.lang.P3}</li>
          <li>{window.lang.P4}</li>
          <li>{window.lang.P5}</li>
        </ol>
      </div>
      {img}
    </div>)

    let b =
    (<div className='card clearfix p-b-0 p-t-0'>
    <div style={{float: 'left'}}>
      <h3 style={{marginTop:0}} className='send'>{window.lang.Please}{window.lang.Please11}</h3>
      <ol className='verify'>
        <li>{window.lang.P11}</li>
        <li>{window.lang.P22}</li>
        <li>{window.lang.P33}</li>
        <li>{window.lang.P44}</li>
        <li>{window.lang.P55}</li>
        <li>{window.lang.P66}</li>
        <li>{window.lang.P77}</li>
        <li>{window.lang.P88}</li>
      </ol>
      </div>
      {img}
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
