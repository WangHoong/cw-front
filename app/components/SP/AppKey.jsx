import React from 'react';
import {APIHelper} from 'app/utils/APIHelper';
import axios from 'axios';

class SP extends React.Component {

  constructor() {
    super();
    this.state = {
      appkey: '------'
    };
  }

  componentDidMount() {
    axios.get(APIHelper.getPrefix() + '/sp/appkey', {withCredentials: true}).then((res) => {
      const res_data = res.data;
      if (res_data.status === 200) {
        this.setState({
          appkey: res_data.data.key
        });
      }
    });
  }

  render() {
    return (
      <span>{this.state.appkey}</span>
    );
  }
};

export default SP;
