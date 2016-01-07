import React, { Component } from 'react'

class BaseChart extends Component{
  shouldComponentUpdate(nextProps, nextState) {

    setTimeout( () => {
        this.$self.clear()
        this.$self.resize()
        this.$self.setOption(nextProps.option)
    }, 250)
    return false
  }
  componentDidMount() {

    var $self = echarts.init(this._renderDOMNode)

    var option = this.props.option

    $self.setOption(option)
    this.$self = $self

  }

  render() {

    var style = this.props.style

    return (
      <div ref={ _ => this._renderDOMNode = _ } style={style}/>
    );
  }
}

export default BaseChart
