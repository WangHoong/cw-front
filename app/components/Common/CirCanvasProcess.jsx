import React from 'react';

class CirCanvasProcess extends React.Component {

  constructor(props) {
    super(props);
  }

  componentDidMount() {
    this.draw();
  }

  draw() {
    const ctx = React.findDOMNode(this.refs['pro-canvas']).getContext('2d');

    ctx.beginPath();
    ctx.arc(60, 60, 50, 0, Math.PI * 2);
    ctx.closePath();
    ctx.fillStyle = '#F6F6F6';
    ctx.fill();

    ctx.beginPath();
    ctx.moveTo(60, 60);
    ctx.arc(60, 60, 50, Math.PI * 1.5, Math.PI * (1.5 + 2 * this.props.process / 100));
    ctx.closePath();
    ctx.fillStyle = this.props.color;
    ctx.fill();

    ctx.beginPath();
    ctx.arc(60, 60, 40, 0, Math.PI * 2);
    ctx.closePath();
    ctx.fillStyle = '#fff';
    ctx.fill();

    ctx.fillStyle = '#333';
    ctx.textAlign = 'center';
    ctx.font = '18px sans-serif';
    ctx.textBaseline = 'middle';
    ctx.moveTo(60, 60);
    ctx.fillText(this.props.process + '%', 60, 60);
  }

  render() {
    return (
      <canvas ref='pro-canvas' width={this.props.width} height={this.props.height}></canvas>
    );
  }

}

export default CirCanvasProcess;
