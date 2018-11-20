import React from 'react';
import { Pane, NavGroup, NavTitle, NavGroupItem } from 'react-photonkit';
import { hashHistory } from 'react-router';

class Sidebar extends React.Component {
	onSelect(index) {
		hashHistory.push(index);
	}

	render() {
		return (
			<Pane ptSize="sm" sidebar>
				<NavGroup activeKey="/" onSelect={this.onSelect}>
					<NavGroupItem eventKey="/" text="Dashboard" glyph="home" />
					<NavGroupItem
						eventKey="/invoices"
						text="Fatture"
						glyph="docs"
					/>
					<NavGroupItem
						eventKey="/clients"
						text="Clienti"
						glyph="users"
					/>
				</NavGroup>
			</Pane>
		);
	}
}

export default Sidebar;
