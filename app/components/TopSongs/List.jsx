import React from 'react';
import Item from './Item.jsx';

class List extends React.Component {
  constructor(props) {
    super(props);
  }

  renderList() {
    let items = this.props.data.map((item, idx) => {
      return (
        <Item key={idx} item={item} />
      );
    });
    return (
      <div className='week-top-songs-list'>
        {items}
      </div>
    );
  }

  render() {
    this.renderList();
  }
};

export default List;
