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

    var $self = echarts.init(React.findDOMNode(this.refs.renderDOMNode))

    var option = this.props.option

    $self.setOption(option)
    this.$self = $self

  }

  render() {

    var style = this.props.style

    return (
      <div ref='renderDOMNode' style={style}/>
    );
  }
}

export default BaseChart
