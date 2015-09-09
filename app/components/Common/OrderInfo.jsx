var React = require('react');
var Reflux = require('reflux');
var Item = React.createClass({
  getInitialState: function() {
    return {
      value: '0'
    };
  },
  chooseCheck: function(){
    this.setState({value:'1'})
  },
  chooseCircle: function(){
    this.setState({value:'3'})
  },
  makeSure: function(){
    this.setState({value:'2'})
  },
  render: function(){
    switch (this.state.value) {
      case '0':
        return(
              <div className='col-sm-4 oi-item'>
                <div className='oi-img'><img src='#'/></div>
                <div className='oi-name'>虾米音乐</div>
                <div className='oi-price'>￥2.56/1000</div>
                <div className='oi-choose'><i className='fa fa-circle-o' onClick={this.chooseCircle}></i><i className='fa fa-check' onClick={this.chooseCheck}></i></div>
              </div>
        );
        break;
      case '1':
          return(
            <div className='col-sm-4 oi-item'>
              <div className='oi-img'><img src='#'/></div>
              <div className='oi-name'>虾米音乐</div>
              <div className='oi-price'>￥2.56/1000</div>
              <div className='oi-choose'><i className='fa fa-check' onClick={this.makeSure}></i>通过</div>
            </div>
          );
          break;
      case '2':
          return(
            <div className='col-sm-4 oi-item'>
              <div className='oi-img'><img src='#'/></div>
              <div className='oi-name'>虾米音乐</div>
              <div className='oi-price'>￥2.56/1000</div>
              <div className='oi-choose'><i className='fa fa-link'></i></div>
            </div>
          );
          break;
      default:
          return(
            <div className='col-sm-4 oi-item'>
              <div className='oi-img'><img src='#'/></div>
              <div className='oi-name'>虾米音乐</div>
              <div className='oi-price'>￥2.56/1000</div>
              <div className='oi-choose'>暂不售卖<i className='fa fa-check' onClick={this.chooseCheck}></i></div>
            </div>
          )    }


    // if(this.state.value=='0'){
    //   return(
    //     <div className='col-sm-4 oi-item'>
    //       <div className='oi-img'><img src='#'/></div>
    //       <div className='oi-name'>虾米音乐</div>
    //       <div className='oi-price'>￥2.56/1000</div>
    //       <div className='oi-choose'><i className='fa fa-circle-o' onClick={this.chooseCircle}></i><i className='fa fa-check' onClick={this.chooseCheck}></i></div>
    //     </div>
    //   )
    // }else if(this.state.value=='1'){
    //   return(
    //     <div className='col-sm-4 oi-item'>
    //       <div className='oi-img'><img src='#'/></div>
    //       <div className='oi-name'>虾米音乐</div>
    //       <div className='oi-price'>￥2.56/1000</div>
    //       <div className='oi-choose'><i className='fa fa-check' onClick={this.makeSure}></i></div>
    //     </div>
    //   )
    // }else if(this.state.value=='2'){
    //   return(
    //     <div className='col-sm-4 oi-item'>
    //       <div className='oi-img'><img src='#'/></div>
    //       <div className='oi-name'>虾米音乐</div>
    //       <div className='oi-price'>￥2.56/1000</div>
    //       <div className='oi-choose'><i className='fa fa-link'></i></div>
    //     </div>
    //   )
    // }else {
    //   return(
    //     <div className='col-sm-4 oi-item'>
    //       <div className='oi-img'><img src='#'/></div>
    //       <div className='oi-name'>虾米音乐</div>
    //       <div className='oi-price'>￥2.56/1000</div>
    //       <div className='oi-choose'>暂不售卖<i className='fa fa-check' onClick={this.chooseCheck}></i></div>
    //     </div>
    //   )
    // }

  }
})
var OrderInfo = React.createClass({
  render: function(){
    return(
      <div className='OrderInfoCard col-sm-12'>
        <Item />
        <Item />
        <Item />
        <Item />
      </div>
    )
  }
})


module.exports = OrderInfo;
