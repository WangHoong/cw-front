var Main = React.createClass({

  componentDidMount: function() {
    var $calendar = $(React.findDOMNode(this.refs.calendar));
    var fc = $calendar.fullCalendar({
      
    });
  },

  render: function() {
    return (
      <div className='calendar-wrap' ref='calendar' />
    );
  }

});

module.exports = Main;
