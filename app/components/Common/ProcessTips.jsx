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
      (window.status <= 0) ? ((this.state.tip=='show') ? (<Process />) : (<a href="javascript:;" onClick={function(){this.replaceTip()}.bind(this)}>欢迎加入DMC！您现在可以查看DMC平台上的歌曲信息。在您完成认证后，第三方服务商才能开始使用您的歌曲，形成收益。</a>)) : (<div></div>)
    )
  }
}

export default ProcessTips
