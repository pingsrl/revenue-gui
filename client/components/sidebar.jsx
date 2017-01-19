import React from 'react';
import { Pane, NavGroup, NavTitle, NavGroupItem } from 'react-photonkit';
import { hashHistory } from 'react-router'


class Sidebar extends React.Component {
  onSelect(index) {
    hashHistory.push(index);
  }

  render() {
    return (
      <Pane ptSize="sm" sidebar>
        <NavGroup activeKey={1} onSelect={this.onSelect}>
          <NavGroupItem eventKey="/" text="Dashboard" />
          <NavGroupItem eventKey="/invoices" text="Fatture" />
        </NavGroup>
      </Pane>
    );
  }
}

export default Sidebar;
