import React, { Component } from 'react';
import { Link } from 'react-router-dom';

export default class Sidebar extends Component {
	render() {
		return (
			<nav-group>
				<nav-item>
					<Link to="/">Dashboard</Link>
				</nav-item>
				<nav-item>
					<Link to="/invoices">Fatture</Link>
				</nav-item>
				<nav-item>
					<Link to="/clients">Clienti</Link>
				</nav-item>
			</nav-group>
		);
	}
}
