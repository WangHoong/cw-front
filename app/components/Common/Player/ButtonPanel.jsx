import React from 'react';

class ButtonPanel extends React.Component {

  constructor(props) {
    super(props);
  }

  render() {
    const isPlaying = this.props.isPlaying;
		const isPause = this.props.isPause;
		const isLoading = this.props.isLoading;
    const isShowPlayBtn = !isPlaying || isPause;
    const clickHandle = isShowPlayBtn ? this.props.playClickHandle : this.props.pauseClickHandle;
    let iconClass;
    if (isLoading) {
      iconClass = 'fa fa-circle-o-notch fa-spin';
    } else {
      const _name = isShowPlayBtn ? 'play' : 'pause';
      iconClass = `fa fa-${_name}`;
    }
    return (
      <button className='ctrl-btn btn btn-warning' onClick={clickHandle}><i className={iconClass}></i></button>
    );
  }
};

export default ButtonPanel;
