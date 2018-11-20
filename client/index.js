import React from 'react';
import { render } from 'react-dom';
import { MemoryRouter, Route, Switch } from 'react-router';
import App from './components/app.jsx';

render(
	<MemoryRouter>
		<App />
	</MemoryRouter>,
	document.getElementById('main')
);
