var React = require('react');
var Reflux = require('reflux');
var SettingsStore = require('../../stores/SettingsStore');
var SettingsActions = require('../../actions/SettingsActions');

var Item = React.createClass({
  onClick: function(){
  },
  render: function(){
    //var url='http://dev.api.topdmc.cn/api/v1/companies/'+this.props.data.id+'/inspect';
    var url = `${window.DMC_OPT.API_PREFIX}/companies/${this.props.data.id}/inspect`;
    return(
      <li className='ce-p'><div className='ce-name'>{this.props.data.name}</div><a href={url}><div className='ce-bt'><button type='button' onClick={this.onClick}>{window.lang.sw}</button></div></a></li>
    )
  }
})

var UserSwitch = React.createClass({
  mixins: [Reflux.connect(SettingsStore, 'companies')],
  componentDidMount: function () {
    SettingsActions.find()
  },
  render: function(){
    if(this.state.companies.loaded){
      // console.log(this.state.companies);
      return(
        <div className='changeCompany'>
          <h1 className='ce-h1'>{window.lang.us}</h1>
          { this.state.companies.data.data.data.map(function(track,i){
            return <Item data={track}  key={i}/>
          }) }
        </div>
      )
    }else {
      return(
        <div className='changeCompany'>
          {window.lang.nodata}
        </div>
      )
    }

  }
})
module.exports = UserSwitch;
