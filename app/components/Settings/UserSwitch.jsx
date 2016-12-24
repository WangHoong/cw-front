var React = require('react');
var Reflux = require('reflux');
var SettingsStore = require('../../stores/SettingsStore');
var SettingsActions = require('../../actions/SettingsActions');

var Item = React.createClass({
  onClick: function(){
  },
  render: function(){
    //var url='http://dev.api.topdmc.cn/api/v1/companies/'+this.props.data.id+'/inspect';
    var url = `${window.DMC_OPT.API_PREFIX}/companies/${this.props.data.id}/inspect?url=${window.location.origin}`;
    return(
      <li className='ce-p'>
        <div className='ce-name'>{this.props.data.name}</div>
        <a href={url} onClick={this.onClick}>
          <div className='ce-bt'>{window.lang.sw}</div>
        </a>
      </li>
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
        <div className='show-wrap topdmc'>
          <div className='t-sb h61'>
            <h3 className='t-sb_detail p-l-20'>{window.lang.us}</h3>
          </div>
          <div className='has-top-bar'>
            <div className='card margin0 border'>
              <ul style={{marginBottom: '-20px'}}>
                { this.state.companies.data.data.data.map(function(track,i){
                  return <Item data={track}  key={i}/>
                }) }
              </ul>
            </div>
          </div>
        </div>
      )
    }else {
      return(
        <div className='show-wrap'>
          <div className='t-sb h61'>
            <h3 className='t-sb_detail p-l-20'>切换公司</h3>
          </div>
          <div className='has-top-bar'>
            <div className='card margin0 border' style={{background: '#fff', paddingTop: 20}}>
              <p className='ce-p ce-center'>{window.lang.nodata}</p>
            </div>
          </div>
        </div>
      )
    }

  }
})
module.exports = UserSwitch;
