var React = require('react');
var Reflux = require('reflux');
var SettingsStore = require('../../stores/SettingsStore');
var SettingsActions = require('../../actions/SettingsActions');
var config = require('config');

var Item = React.createClass({
  onClick: function(){
  },
  render: function(){
    //var url='http://dev.api.topdmc.cn/api/v1/companies/'+this.props.data.id+'/inspect';
    var url = `${config['API_PREFIX']}/${this.props.data.id}/inspect`;
    return(
      <li className='ce-p'><div className='ce-name'>{this.props.data.name}</div><a href={url}><div className='ce-bt'><button type='button' onClick={this.onClick}>切换</button></div></a></li>
    )
  }
})

var Main = React.createClass({
  mixins: [Reflux.connect(SettingsStore, 'companies')],
  componentDidMount: function () {
    SettingsActions.find()
  },
  render: function(){
    if(this.state.companies.loaded){
      // console.log(this.state.companies);
      return(
        <div className='changeCompany'>
          <h1 className='ce-h1'>切换公司</h1>
          { this.state.companies.data.data.data.map(function(track,i){
            return <Item data={track}  key={i}/>
          }) }
        </div>
      )
    }else {
      return(
        <div className='changeCompany'>
          暂无数据
        </div>
      )
    }

  }
})
module.exports = Main;
