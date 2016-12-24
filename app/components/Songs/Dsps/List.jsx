import React from 'react';
import {APIHelper} from 'app/utils/APIHelper';
import axios from 'axios';
import Item from './Item.jsx';
import data from './DefaultData.jsx';

class List extends React.Component {
  constructor(props) {
    super();
    this.itemChecked=this.itemChecked.bind(this)
    this.ItemClick=this.ItemClick.bind(this)
    this.state = {
      data: props.publish_info ? JSON.parse(props.publish_info) : data
    };
  }
  componentDidMount() {
    axios.get(APIHelper.getPrefix() + '/sp/appkey', {withCredentials: true}).then((res) => {
      const res_data = res.data;
      if (res_data.status === 200) {
        this.setState({
          appkey: res_data.data.key
        });
      }
    });
  }
  itemStatus(arr){
    for(let a in arr) {
      if(arr[a].checked) {
        return true
      }
    }
  }
  itemChecked(i,j) {
    this.state.data[i].children[j].checked = !this.state.data[i].children[j].checked
    let arr = this.state.data[i].children
    if(this.itemStatus(arr)){
      this.state.data[i].all = true
    } else {
      this.state.data[i].all = false
    }
    this.setState(this.state)
  }
  ItemClick(i){
    for(let j in this.state.data){
      if(this.state.data[j].title === i){
        this.state.data[j].all = !this.state.data[j].all
        this.state.data[j].children = this.state.data[j].children.map(item => {
          item.checked = this.state.data[j].all
          return item
        })
        this.setState(this.state)
      }
    }
    this.setState(this.state)
  }
  getValue() {
    return this.state.data;
  }
  renderList() {
    const dsps = this.state.data
    return dsps && dsps.length > 0 && dsps.map((item, idx) => {
      return (
        <Item key={idx} dsp={item} id={idx} itemChecked={this.itemChecked} ItemClick={this.ItemClick} />
      )
    })
  }
  render() {
    return (
      <div className='ablums-detail-dsps-list'>
        {this.renderList()}
      </div>
    )
  }
};

export default List;
