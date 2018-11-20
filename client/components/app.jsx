import React, { Component } from 'react';
import { Window, Content, PaneGroup, Pane } from 'react-photonkit';

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
							{this.props.children}
						</Pane>
					</PaneGroup>
				</Content>
				<Footer />
			</Window>
		);
	}
}

export default App;
