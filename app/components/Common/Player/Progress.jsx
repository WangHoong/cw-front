import React from 'react';

class Progress extends React.Component {

  constructor(props) {
    super(props);
  }

  render() {
    let percent_width = {
      width: this.props.percent + '%'
    };
    return (
      <div className='prog'>
        <div className='prog-inner' style={percent_width}></div>
      </div>
    );
  }

};

export default Progress;
