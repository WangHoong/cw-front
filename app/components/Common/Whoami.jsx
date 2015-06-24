var PercentCircle = require('app/components/common/PercentCircle.jsx');
var TopSongs = require('app/components/common/TopSongs.jsx');
var TopSingers = require('app/components/common/TopSingers.jsx');
export class Whoami extends React.Component {
  constructor(props){
    super(props);
  }

  render(){
    var _style = {
      backgroundImage: `'url("${this.props.avatar}") no-repeat'`
    };
    var _data=["4/7","6/7","3/7"];
    return(
      <div>
        <span style={_style}>{this.props.username}</span>
        <PercentCircle percent={_data}/>
        <TopSongs />
        <TopSingers />
      </div>
    );
  }
}

Whoami.defaultProps = {
  username: window.DMC_USERNAME,
  avatar: window.DMC_AVATAR
};
