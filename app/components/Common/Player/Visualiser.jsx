import React from 'react';

window.requestAnimFrame = (function() {
  return  window.requestAnimationFrame || window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame || window.msRequestAnimationFrame || window.oRequestAnimationFrame;
})();

window.cancelAnimationFrame = (function() {
  return  window.cancelAnimationFrame || window.webkitCancelAnimationFrame || window.mozCancelAnimationFrame || window.msCancelAnimationFrame || window.oCancelAnimationFrame;
})();

class Visualiser extends React.Component {

  constructor(props) {
    super(props);
    this.analyser = null;
    this.animationFrameId = null;
    this.frameLooper = this.frameLooper.bind(this);
  }

  componentWillUnmount() {
    window.cancelAnimationFrame(this.animationFrameId);
  }

  getCanvasElement() {
    return React.findDOMNode(this.refs.canvas);
  }

  getCanvasWrap() {
    return React.findDOMNode(this.refs.wrap);
  }

  componentDidMount() {
    this.canvas = this.getCanvasElement();
    // 适配 Retina
    this.canvas.style.width = $(this.getCanvasWrap()).width();
    this.canvas.style.height = $(this.getCanvasWrap()).height();
    this.canvas.width = $(this.getCanvasWrap()).width() * 2;
    this.canvas.height = $(this.getCanvasWrap()).height() * 2;
    this.ctx = this.canvas.getContext('2d');
    this.ctx.scale(2, 2);
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.analyser) {
      this.analyser = nextProps.analyser;
      this.frameLooper();
    }
  }

  frameLooper() {
    window.cancelAnimationFrame(this.animationFrameId);

    let fbc_array = new Uint8Array(this.analyser.frequencyBinCount);
    this.analyser.getByteFrequencyData(fbc_array);
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    this.ctx.fillStyle = '#efefef';
    let bars = 100;
    let space = parseInt((this.canvas.width / bars) / 2);
    for (var i = 0; i < bars; i++) {
      let bar_x = i * space;
      let bar_width = 3;
      let bar_height = -(fbc_array[i] / 3);
      this.ctx.fillRect(bar_x, this.canvas.height, bar_width, bar_height);
    }

    this.animationFrameId = window.requestAnimationFrame(this.frameLooper);
  }

  render() {
    return (
      <div className='visualiser-wrap' ref='wrap'>
        <canvas className='visualiser-canvas' ref='canvas'>你的浏览器不支持频谱！</canvas>
      </div>
    );
  }

};

export default Visualiser;
