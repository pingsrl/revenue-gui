import React from 'react';
import { render } from 'react-dom';
import { Router, Route, IndexRoute, hashHistory } from 'react-router';
import App from './components/app.jsx';
import Dashboard from './views/dashboard.jsx';
import Invoices from './views/invoices.jsx';
import Clients from './views/clients.jsx';

render(
	<Router history={hashHistory}>
		<Route path="/" component={App}>
			<IndexRoute component={Dashboard} />
			<Route path="/invoices" component={Invoices} />
			<Route path="/clients" component={Clients} />
		</Route>
	</Router>,
	document.getElementById('main')
);
