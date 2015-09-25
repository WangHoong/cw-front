import React from 'react';
import Item from './Item.jsx';

class List extends React.Component {
  constructor(props) {
    super(props);
  }

  renderList() {
    const items = this.props.data.map((item, idx) => {
      return <Item key={'track' + item.track_id} item={item} />
    });
    return items;
  }

  render() {
    return (
      <div className='week-top-songs-list'>
        <ul className='row'>{this.renderList()}</ul>
      </div>
    );
  }
};

export default List;
