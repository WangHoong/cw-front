import React from 'react';
import {Howl} from './Howler';

class Player extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      isPlaying: false,
			isPause: false,
			isLoading: false,
			volume: 1
    };
  }

  componentDidMount() {
    this.initSoundObject();
    console.log(this.howler);
  }

  play() {
    this.setState({
      isPlaying: true,
      isPause: false
    });
    if (!this.howler) {
      this.initSoundObject();
    }
  }

  clearSoundObject() {
    if (this.howler) {
      this.howler.stop();
      this.howler = null;
    }
  }

  initSoundObject() {
    this.clearSoundObject();
    this.setState({
      isLoading: true
    });
    const self = this;
    this.howler = new Howl({
      src: self.props.url,
      volume: self.state.volume,
      onload: self.loadHandle,
      onend: self.endHandle
    });
  }

  render() {
    return (
      <button className='btn btn-default'>播放</button>
    );
  }

};

export default Player;
