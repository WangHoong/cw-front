import React from 'react';
import {APIHelper} from 'app/utils/APIHelper';
import axios from 'axios';
import Item from './Item.jsx';
const data = [
{title: 'QQ音乐', all : false,children:[{title: '试听',checked: false},{title: '下载',checked: false},{title: 'VIP',checked: false}]},
{title: '百度音乐', all : false,children:[{title: '试听',checked: false},{title: '下载',checked: false},{title: 'VIP',checked: false}]},
{title: '搜狐音乐', all : false,children:[{title: '试听',checked: false},{title: '下载',checked: false},{title: 'VIP',checked: false}]},
{title: '阿里音乐1', all : false,children:[{title: '试听',checked: false},{title: '下载',checked: false},{title: 'VIP',checked: false}]},
{title: '秀米音乐1',  all : false,children:[{title: '试听',checked: false},{title: '下载',checked: false},{title: 'VIP',checked: false}]},
{title: '阿里音乐2', all : false,children:[{title: '试听',checked: false},{title: '下载',checked: false},{title: 'VIP',checked: false}]},
{title: '秀米音乐2',  all : false,children:[{title: '试听',checked: false},{title: '下载',checked: false},{title: 'VIP',checked: false}]},
{title: '阿里音乐3', all : false,children:[{title: '试听',checked: false},{title: '下载',checked: false},{title: 'VIP',checked: false}]},
{title: 'QQ音乐4', all : false,children:[{title: '试听',checked: false},{title: '下载',checked: false},{title: 'VIP',checked: false}]},
{title: '百度音乐4', all : false,children:[{title: '试听',checked: false},{title: '下载',checked: false},{title: 'VIP',checked: false}]},
{title: '搜狐音乐4', all : false,children:[{title: '试听',checked: false},{title: '下载',checked: false},{title: 'VIP',checked: false}]},
{title: '阿里音乐4', all : false,children:[{title: '试听',checked: false},{title: '下载',checked: false},{title: 'VIP',checked: false}]},]
class List extends React.Component {
  constructor(props) {
    super();
    this.state = {
      data: props.publish_info ? JSON.parse(props.publish_info) : data
    };
  }
  componentDidMount() {
    this.itemChecked=this.itemChecked.bind(this)
    this.ItemClick=this.ItemClick.bind(this)
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
      <div>
        {this.renderList()}
      </div>
    )
  }
};

export default List;
