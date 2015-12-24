import React from 'react';
import Reflux from 'reflux';
import Classnames from 'classnames';
import Actions from '../../actions/AuthorizationActions';
import AuthorizationStore from '../../stores/AuthorizationStore';
import Loader from 'app/components/Common/Loader.jsx';

let {Component} = React;

class Main extends Component {

  constructor() {
    super();

    this.state = {
      loading: true,
      data: {}
    };

    this.priceChange = this.priceChange.bind(this);
    this.create = this.create.bind(this);
    this.renderAgreedList = this.renderAgreedList.bind(this);
  }

  /**
   * componentDidMount
   */
  componentDidMount() {

    this.unsubscribe = AuthorizationStore.listen((data)=> {
      this.state.loading = false;
      this.setState({data: data});
    });

    Actions.get();
  }

  /**
   * componentWillUnmount
   */
  componentWillUnmount() {
    this.unsubscribe();
  }

  /**
   * 创建所有歌曲授权请求
   */
  create() {

    Actions.create({
      price: this.state.price
    });
  }

  /**
   * 价格变化事件
   */
  priceChange(e) {
    this.state.price = e.target.value;
    this.state.disabled = (~~this.state.price) === 0;
    this.setState(this.state);
  }

  renderForm() {
    if (!this.state.data.authorization) {
      return (
        <div style={{margin:"30px"}}>
          <form className="form-inline">
            <div className="form-group">
              <label className="sr-only" for="exampleInputAmount"></label>

              <div className="input-group">
                <input onChange={this.priceChange} type="text" className="form-control" value={this.state.price}
                       id="exampleInputAmount" placeholder="0.00"/>

                     <div className="input-group-addon">{window.lang.rmb}/1000{window.lang.times}</div>
              </div>
            </div>
            <button type="button" onClick={this.create} disabled={this.state.disabled} style={{marginLeft:"10px"}}
                    className="btn btn-primary">
              申请所有歌曲授权
            </button>
          </form>
        </div>
      );
    }

    return (
      <h3 style={{marginTop:"0px"}}>
      <span className="label label-success">
       {window.lang.tips} {moment(this.state.data.authorization.created_at).fromNow()}{window.lang.tips0}{this.state.data.authorization.price}{window.lang.tips1}
      </span>
      </h3>
    );
  }

  renderAgreedList() {

    if (!this.state.data.authorization) {
      return;
    }

    return this.state.data.authorization['replies'].map(function (reply) {
      let classes = Classnames('label', {
        'label-success': reply.status !== 0,
        'label-danger': reply.status === 0
      });
      return (
        <tr key={reply.company.id}>
          <td>{reply.company.name}</td>
          <td><span className={classes}>{reply.status === 1 ? "已授权" : "未通过"}</span></td>
          <td>{reply.created_at?moment(reply.created_at).fromNow():'--'}</td>
        </tr>
      );
    });
  }

  /**
   * render
   * @returns {XML}
   */
  render() {

    if (this.state.loading) {
      return <Loader/>;
    }
    return (
      <div style={{paddingTop:"30px"}}>
        <div>
          <div>
            {false && this.renderForm()}
          </div>
          <div style={{marginTop:"20px",overflow:"hidden"}}>
            <table className='table table-hover'>
              <thead>
              <tr>
                <th>{window.lang.sp_cp}</th>
                <th width="100">{window.lang.sp_cpst}</th>
                <th width="150">{window.lang.sp_cptime}</th>
              </tr>
              </thead>
              <tbody>
              {this.renderAgreedList()}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    );
  }
}

export default Main;
