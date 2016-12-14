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
    return (
      <div
        onMouseOver={this.mouseOverHandle.bind(this)}
        onMouseOut={this.mouseOutHandle.bind(this)}>
        <div className='ablums-div'>
          <div>
            <img src ={this.props.dsp.img} />
          </div>
          {this.props.dsp.title}
          {this.props.ItemClick &&
          <div style={{width:16,height:16,cursor:'pointer'}} onClick={() => {this.props.ItemClick(this.props.dsp.title)}}>
            <img style={{marginTop:-39,marginLeft:0}} src={this.props.dsp.all ? 'images/albums_checked.png' : 'images/albums_check.png'} />
          </div>
          }
          {/* // <input onChange={() => {this.props.ItemClick(this.props.dsp.title)}} type='checkbox' checked={this.props.dsp.all} style={{position:'absolute',top:30,left:130,width:14,height:14}} />} */}
        </div>
        <ul style={{display: this.state.isShow ? 'block' : 'none'}} className='ablums-ul'>
          {this.renderChildren()}
        </ul>
      </div>
    );
  }
};

export default Item;
