import React from 'react';
class Process extends React.Component {

  render() {
    let txt
    let style1 = {marginLeft: '230px', width: '140px'}
    let a =
    (<div className='card clearfix'>
      <div style={{float: 'left'}}>
        <h3 style={{marginTop:0}}>{window.lang.Please}</h3>
        <ol>
          <li>{window.lang.P1}</li>
          <li>{window.lang.P2}</li>
          <li>{window.lang.P3}</li>
          <li>{window.lang.P4}</li>
          <li>{window.lang.P5}</li>
        </ol>
      </div>
      <img style={style1} src={'../images/topdmc.jpg'} alt="TopDMC微信公众号二维码" />
    </div>)

    let b =
    (<div className='card clearfix'>
    <div style={{float: 'left'}}>
      <h3 style={{marginTop:0}}>{window.lang.Please}</h3>
      <ol>
        <li>{window.lang.P11}</li>
        <li>{window.lang.P22}</li>
        <li>{window.lang.P33}</li>
        <li>{window.lang.P44}</li>
        <li>{window.lang.P55}</li>
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
