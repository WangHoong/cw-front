import React from 'react';

let {Component} = React;

class Main extends Component {

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
              <label className="sr-only" for="exampleInputAmount">Amount (in dollars)</label>
              <div className="input-group">
                <input type="text" className="form-control" id="exampleInputAmount" placeholder="0.00"/>
                  <div className="input-group-addon">元/1000次</div>
                </div>
              </div>
              <button type="submit" style={{marginLeft:"10px"}} className="btn btn-primary">申请所有歌曲授权</button>
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
