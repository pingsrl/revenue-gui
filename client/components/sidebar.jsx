import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';

class Sidebar extends Component {
	render() {
		return (
			<nav-group>
				<nav-item onClick={() => this.props.history.push('/')}>
					Dashboard
				</nav-item>
				<nav-item onClick={() => this.props.history.push('/invoices')}>
					Fatture
				</nav-item>
				<nav-item onClick={() => this.props.history.push('/clients')}>
					Clienti
				</nav-item>
			</nav-group>
		);
	}
}

export default withRouter(Sidebar);
