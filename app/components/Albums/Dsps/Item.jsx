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
        <li className='ablums-p' key={key}>
          {this.props.ItemClick && <input type='checkbox' onChange={() => {this.props.itemChecked(this.props.id,key)}} checked={item.checked} />}
          <span>
            {item.title}
          </span>
        </li>
      )
    })
  }
  render() {
    const backgroundColorStyle = !this.props.ItemClick ? {backgroundColor: '#fff'} : {backgroundColor: this.props.dsp.all ? '#999' : '#fff'}
    return (
      <div
        style={this.props.ItemStyle}
        onMouseOver={this.mouseOverHandle.bind(this)}
        onMouseOut={this.mouseOutHandle.bind(this)}>
        <div onClick={() => {this.props.ItemClick(this.props.dsp.title)}}
          className='ablums-div'
          style={backgroundColorStyle}>
          <div style={{overflow: 'hidden',marginTop:7, marginLeft: 20,width:47, height: 46, border: '1px solid #e5e7e9',float: 'left', borderRadius: '50%'}}>
            <img style={{marginTop: -18}} src ={this.props.dsp.img} />
          </div>
          {this.props.dsp.title}
        </div>
        <ul style={{display: this.state.isShow ? 'block' : 'none'}} className='ablums-ul'>
          {this.renderChildren()}
        </ul>
      </div>
    );
  }
};

export default Item;
