import React from 'react';
import ButtonPanel from './ButtonPanel.jsx';
import Visualiser from './Visualiser.jsx';
import Progress from './Progress.jsx';

window.AudioContext = (function() {
  return  window.AudioContext || window.webkitAudioContext || window.mozAudioContext || window.msAudioContext || window.oAudioContext;
})();

class Player extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      isPlaying: false,
			isPause: false,
			isLoading: false,
			volume: 1,
      percent: 0,
      analyser: null
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

  initSoundObject() {
    this.clearSoundObject();
    this.setState({
      isLoading: true
    });
    this.sound = new Audio(this.props.url);
    this.sound.volume = this.state.volume;
    this.sound.loop = true;
    this.sound.crossOrigin = 'anonymous';
    this.sound.addEventListener('canplay', this.canplayHandle.bind(this), false);
    this.sound.addEventListener('timeupdate', this.timeupdateHandle.bind(this), false);
  }

  clearSoundObject() {
    if (this.sound) {
      this.sound.removeEventListener('canplay', this.canplayHandle.bind(this), false);
      this.sound.removeEventListener('timeupdate', this.timeupdateHandle.bind(this), false);
      this.sound.pause();
      this.sound = null;
    }
  }

  canplayHandle() {
    if (!this.sound) {
      return;
    }
    this.setState({
      isLoading: false
    });
    this.sound.play();
    if (window.AudioContext) {
      this.configureAudioContext();
    }
  }

  configureAudioContext() {
    let context = new AudioContext();
    let analyser = context.createAnalyser();

    let source = context.createMediaElementSource(this.sound);
    source.connect(analyser);
    analyser.connect(context.destination);

    this.setState({ analyser: analyser });
  }

  timeupdateHandle() {
    if (!this.sound) {
      return;
    }
    const percent = this.sound.currentTime / this.sound.duration * 100;
    this.setState({
      percent: percent
    });
  }

  render() {
    return (
      <div className='player-panel'>
        <ButtonPanel
          isPlaying={this.state.isPlaying}
          isPause={this.state.isPause}
          isLoading={this.state.isLoading}
          playClickHandle={() => {this.playClickHandle()}}
          pauseClickHandle={() => {this.pauseClickHandle()}} />
        <Visualiser analyser={this.state.analyser} />
        <Progress percent={this.state.percent} />
      </div>
    );
  }

};

export default Player;
