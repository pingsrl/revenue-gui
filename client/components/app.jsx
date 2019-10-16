import React, { Component } from 'react';
import { Route, Switch } from 'react-router';
import Dashboard from '../views/dashboard';
import Invoices from '../views/invoices';
import Clients from '../views/clients';

import Sidebar from './sidebar';

class App extends Component {
	render() {
		return (
			<ph-window>
				<window-content>
					<div class="pane-group">
						<div class="pane-sm sidebar">
							<Sidebar />
						</div>

						<div class="pane">
							<Switch>
								<Route exact path="/" component={Dashboard} />
								<Route path="/invoices" component={Invoices} />
								<Route path="/clients" component={Clients} />
							</Switch>
						</div>
					</div>
				</window-content>
				<tool-bar />
			</ph-window>
		);
	}
}

export default App;
