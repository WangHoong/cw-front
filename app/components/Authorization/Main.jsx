import React from 'react';
import Reflux from 'reflux';
import Actions from '../../actions/AuthorizationActions';
import AuthorizationStore from '../../stores/AuthorizationStore';

let {Component} = React;

class Main extends Component {

  constructor() {
    super();

    this.state = {
      disabled: true
    };

    this.priceChange = this.priceChange.bind(this);
    this.create = this.create.bind(this);
  }

  /**
   * componentDidMount
   */
  componentDidMount() {
    this.unsubscribe = AuthorizationStore.listen((data)=> {
      this.setState({data: data});
    });
  }

  /**
   * componentWillUnmount
   */
  componentWillUnmount() {
    this.unsubscribe();
  }

  /**
   * 创建
   */
  create() {

    Actions.create({
      price: this.state.price
    });
  }

  /**
   *
   */
  priceChange(e) {
    this.state.price = e.target.value;
    this.state.disabled = ~~this.state.price=== 0;
    this.setState(this.state);
  }

  /**
   * render
   * @returns {XML}
   */
  render() {
    return (
      <div className='list-wrap'>
        <div className='has-top-bar'>
          <form className="form-inline">
            <div className="form-group">
              <label className="sr-only" for="exampleInputAmount"></label>

              <div className="input-group">
                <input onChange={this.priceChange} type="text" className="form-control" value={this.state.price}
                       id="exampleInputAmount" placeholder="0.00"/>

                <div className="input-group-addon">元/1000次</div>
              </div>
            </div>
            <button type="button" onClick={this.create} disabled={this.state.disabled} style={{marginLeft:"10px"}}
                    className="btn btn-primary">
              申请所有歌曲授权
            </button>

          </form>
        </div>
        <div style={{marginTop:"20px"}}>
          <table className='table'>
            <thead>
            <tr>
              <th>公司</th>
              <th width="80">状态</th>
              <th width="100">授权时间</th>
            </tr>
            </thead>
            <tr>
              <th>--</th>
              <th><span className="label label-success">已授权</span></th>
              <th>2015/10/20</th>
            </tr>
            <tr>
              <th>--</th>
              <th><span className="label label-success">已授权</span></th>
              <th>2015/10/20</th>
            </tr>
          </table>
        </div>
      </div>
    );
  }
}

export default Main;
