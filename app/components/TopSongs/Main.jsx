import React from 'react';
import {APIHelper} from 'app/utils/APIHelper';
import axios from 'axios';
import List from './List.jsx';
import Loader from '../Common/Loader.jsx';

class Main extends React.Component {
  constructor() {
    super();
    this.state = {
      loaded: false,
      data: []
    };
  }

  componentDidMount() {
    const url = APIHelper.getPrefix() + '/rpt/top_week';
    axios.get(url).then((response) => {
      if (response.data.status === 200) {
        this.state.data = response.data.data;
        this.state.loaded = true;
        this.setState(this.state);
      }
    }).catch(function(response) {
      this.state.loaded = true;
      this.setState(this.state);
    });
  }

  render() {
    const {loaded, data} = this.state;
    if (!loaded) {
      return (
        <Loader />
      );
    }
    return (
      <div className='week-top-songs'>
        <List data={data} />
      </div>
    );
  }
};

export default Main;
