var React = require('react');
var classNames = require('classnames');

var AddCardTips = React.createClass({

  propTypes: {
    title: React.PropTypes.string.isRequired,
    iconClassName: React.PropTypes.string.isRequired
  },

  getDefaultProps: function() {
    return {
      title: window.lang.al_addtr,
      iconClassName: 'music'
    };
  },

  render: function() {
    var props = this.props;
    var iconClass = classNames('fa', 'fa-' + props.iconClassName);
    return (
      <li className='col-sm-4 add-card-tips' {...this.props}>
        <div className='add-card-tips-inner'>
          <i className={iconClass}></i><span>{props.title}</span>
        </div>
      </li>
    );
  }

});

module.exports = AddCardTips;
