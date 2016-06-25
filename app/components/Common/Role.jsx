import React from 'react';
import _ from 'lodash';

class Role extends React.Component {

  constructor(props) {
    super(props);
  }

  render() {
    const _host = window.location.hostname;
    if (_host.indexOf('global') !== -1) {
      return React.createElement(this.props.component || 'div', this.props, this.props.children);
    } else {
      const roleName = this.props.roleName;
      const userRoleName = window.currentUser.role_names || [];
      const hasRole = _.includes(userRoleName, roleName);
      if (hasRole) {
        return React.createElement(this.props.component || 'div', this.props, this.props.children);
      }
      return React.createElement('span');
    }
  }

};

Role.propTypes = {
  roleName: React.PropTypes.string.isRequired
};

export default Role;
