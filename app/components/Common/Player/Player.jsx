import React from 'react';
import ButtonPanel from './ButtonPanel.jsx';

class Player extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      isPlaying: false,
			isPause: false,
			isLoading: false,
			volume: 1,
      percent: 0
    };
  }

  componentWillUnmount() {
    this.clearSoundObject();
  }

  playClickHandle() {
    if (this.state.isPlaying && !this.state.isPause) {
			return;
		};
		this.setState({
      isPlaying: true,
      isPause: false
    });
    if (!this.sound) {
      this.initSoundObject();
    } else {
      this.sound.play();
    }
  }

  pauseClickHandle() {
    const isPause = !this.state.isPause;
    this.setState({
      isPause: isPause
    });
    isPause ? this.sound.pause() : this.sound.play();
  }

  clearSoundObject() {
    if (this.sound) {
      this.sound.pause();
      this.sound = null;
    }
  }

  initSoundObject() {
    this.clearSoundObject();
    this.setState({
      isLoading: true
    });
    this.sound = new Audio(this.props.url);
    this.sound.volume = this.state.volume;
    this.sound.loop = true;
    this.sound.addEventListener('canplay', this.canplayHandle.bind(this), false);
    this.sound.addEventListener('timeupdate', this.timeupdateHandle.bind(this), false);
  }

  canplayHandle() {
    this.setState({
      isLoading: false
    });
    this.sound.play();
  }

  timeupdateHandle() {
    const percent = this.sound.currentTime / this.sound.duration * 100;
    this.setState({
      percent: percent
    });
  }

  render() {
    const progWidth = {width: this.state.percent + '%'};
    const bg = {backgroundImage: `url(${this.props.bg})`};
    return (
      <div className='player-panel'>
        <div className='bg' style={bg}></div>
        <ButtonPanel
          isPlaying={this.state.isPlaying}
          isPause={this.state.isPause}
          isLoading={this.state.isLoading}
          playClickHandle={() => {this.playClickHandle()}}
          pauseClickHandle={() => {this.pauseClickHandle()}} />
        <div className='prog'>
          <div className='prog-inner' style={progWidth}>{}</div>
        </div>
      </div>
    );
  }

};

export default Player;
