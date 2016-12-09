import React from 'react';
import {APIHelper} from 'app/utils/APIHelper';
import axios from 'axios';

class Item extends React.Component {
  constructor() {
    super()
    this.state = {
      isShow: false
    }
  }

  mouseOverHandle() {
    this.state.isShow = true
    this.setState(this.state)
  }

  mouseOutHandle() {
    this.state.isShow = false
    this.setState(this.state)
  }

  renderChildren() {
    return this.props.dsp.children.map((item, key) => {
      return (
        <li><input type='checkbox' onChange={() => {this.props.itemChecked(this.props.id,key)}} checked={item.checked} />{item.title}</li>
      )
    })
  }

  render() {
    return (
      <div
        style={{float: 'left', width: '22.2%', height: 50, margin: 5, position: 'relative'}}
        onMouseOver={this.mouseOverHandle.bind(this)}
        onMouseOut={this.mouseOutHandle.bind(this)}>
        <div onClick={() => {this.props.ItemClick(this.props.dsp.title)}} style={{backgroundColor: this.props.dsp.all ? '#999' : '#fff', height: '100%', lineHeight: '50px', textAlign: 'center'}}>{this.props.dsp.title}</div>
        <ul style={{display: this.state.isShow ? 'block' : 'none', position: 'absolute', top: 50, zIndex: 31, left: 0, width: '100%', backgroundColor: '#fff', height: 100, border: '1px solid red'}}>
          {this.renderChildren()}
        </ul>
      </div>
    );
  }
};

export default Item;
