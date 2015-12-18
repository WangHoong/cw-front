import React from 'react'
import Process from 'app/components/Common/Process.jsx'

class ProcessTips extends React.Component {

  constructor(props){
    super(props);
    this.state = {
      tip: 'hidden'
    }
  }

  replaceTip() {
    this.setState({
      tip: 'show'
    })
  }
  render() {
    return (
      (window.status <= 0) ? ((this.state.tip=='show') ? (<Process />) : (<a href="javascript:;" onClick={function(){this.replaceTip()}.bind(this)}>{window.lang.Welcome}</a>)) : (<div></div>)
    )
  }
}

export default ProcessTips
