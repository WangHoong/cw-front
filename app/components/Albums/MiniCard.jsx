'use strict';
var React = require('react');
var debug = require('debug')('topdmc:Components/Artist/MiniCard');

/**=================================================================
 *  Artist MiniCard
 ===================================================================*/
var MiniCard = React.createClass({

  propTypes: {
    rainbowColor: React.PropTypes.string,
    onRemove: React.PropTypes.func.isRequired,
    data: React.PropTypes.object.isRequired,
    readonly: React.PropTypes.bool
  },

  getDefaultProps: function () {
    return {
      readonly: false,
      rainbowColor: '#12bdc4',
      data: {
        id: '',
        name: '专辑名称',
        artistName: '歌手名',
        date: '发行日期',
        photo: 'images/default-album-card.jpg'
      }
    };
  },

  handleRemove: function (event) {
    event.preventDefault();
    debug('handle remove');
    this.props.onRemove(event, this.props.data);
  },

  renderButtons: function () {
    if (this.props.readonly) {
      return (<span/>);
    }

    var data=this.props.data;

    return ( <a type='button' className='btn btn-danger' data-id={data._id} onClick={this.handleRemove}><i
        className='fa fa-minus' data-id={data._id}></i></a>);
  },

  render: function () {
    var data=this.props.data;
    var photo = data.photo || 'images/default-album-card.jpg';
    var style = {
      backgroundImage: 'url(' + photo + ')'
    };
    return (
        <li className='col-sm-4 card-added'>
          <div className='card-added-inner'>
            <div className='rainbow-bar' style={{backgroundColor: this.props.rainbowColor}}></div>
            <div className='info'>
              <div className='thumb' style={style}></div>
              <div className='txt'>
                <p>{data.name}</p>
                <p>{data.artistName}</p>
              </div>
            </div>

            {this.renderButtons()}
          </div>
        </li>
    );
  }
});

module.exports = MiniCard;
