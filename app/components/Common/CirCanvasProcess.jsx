import React from 'react';

class CirCanvasProcess extends React.Component {

  constructor(props, context) {
    super(props, context);
  }

  componentDidMount() {
    this.draw();
  }

  draw() {
    const canvas = this._proCanvas
    const ctx = canvas.getContext('2d');

    // retina
    canvas.width = this.props.width * 2;
    canvas.height = this.props.height * 2;
    canvas.style.width = this.props.width + 'px';
    canvas.style.height = this.props.height + 'px';

    ctx.beginPath();
    ctx.arc(120, 120, 100, 0, Math.PI * 2);
    ctx.closePath();
    ctx.fillStyle = '#F6F6F6';
    ctx.fill();

    ctx.beginPath();
    ctx.moveTo(120, 120);
    ctx.arc(120, 120, 100, Math.PI * 1.5, Math.PI * (1.5 + 2 * this.props.process / 100));
    ctx.closePath();
    ctx.fillStyle = this.props.color;
    ctx.fill();

    ctx.beginPath();
    ctx.arc(120, 120, 80, 0, Math.PI * 2);
    ctx.closePath();
    ctx.fillStyle = '#fff';
    ctx.fill();

    ctx.fillStyle = '#333';
    ctx.textAlign = 'center';
    ctx.font = '36px sans-serif';
    ctx.textBaseline = 'middle';
    ctx.moveTo(120, 120);
    ctx.fillText(this.props.process + '%', 120, 120);
  }

  render() {
    return (
      <canvas ref={ _ => this._proCanvas = _ }></canvas>
    );
  }

}

export default CirCanvasProcess;
