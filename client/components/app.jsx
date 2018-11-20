import React, { Component } from 'react';
import { Route, Switch } from 'react-router';
import { Window, Content, PaneGroup, Pane } from 'react-photonkit';
import Dashboard from '../views/dashboard.jsx';
import Invoices from '../views/invoices.jsx';
import Clients from '../views/clients.jsx';

import Header from './header.jsx';
import Footer from './footer.jsx';
import Sidebar from './sidebar.jsx';

class App extends Component {
	render() {
		return (
			<Window>
				<Header />
				<Content>
					<PaneGroup>
						<Sidebar />
						<Pane className="padded-more">
							<Switch>
								<Route exact path="/" component={Dashboard} />
								<Route path="/invoices" component={Invoices} />
								<Route path="/clients" component={Clients} />
							</Switch>
						</Pane>
					</PaneGroup>
				</Content>
				<Footer />
			</Window>
		);
	}
}

export default App;
