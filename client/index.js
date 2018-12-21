const Photon = require('electron-photon');
import React from 'react';
import { render } from 'react-dom';
import { Route, Switch } from 'react-router';
import { HashRouter } from 'react-router-dom';

import App from './components/app.jsx';

render(
	<HashRouter>
		<App />
	</HashRouter>,
	document.getElementById('main')
);
