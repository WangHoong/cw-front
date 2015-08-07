import React from 'react'
import Process from 'app/components/Common/Process.jsx'

class ProcessTips extends React.Component {

  constructor(props){
    super(props);
    this.state = {
      tip: 0
    }
  }

  replaceTip() {
    this.setState({
      tip: 1
    })
  }
  render() {
    return (
      this.state.tip ? (<Process />) : (<a href="javascript:;" onClick={function(){this.replaceTip()}.bind(this)}>欢迎加入DMC！您现在可以查看DMC平台上的歌曲信息。在您完成认证后，第三方服务商才能开始使用您的歌曲，形成收益。</a>)
    )
  }
}

export default ProcessTips
