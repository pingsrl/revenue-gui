import React, { Component } from 'react';
import { shell } from 'electron';

import InvoicesStore from '../stores/invoices.js';

import numeral from '../lib/numeral.js';

import Table from '../components/table.jsx';
import Loader from '../components/loader.jsx';

let columns = [
	{
		key: 'purchase_order',
		label: '#',
		transform: el => el.toUpperCase()
	},
	{
		key: 'id',
		label: 'Link',
		transform: el => (
			<a
				href="#"
				onClick={e => {
					e.preventDefault();
					shell.openExternal('https://pingsrl.harvestapp.com/invoices/' + el);
				}}
			>
				apri
			</a>
		)
	},
	{
		key: 'issue_date',
		label: 'Emissione'
	},
	{
		key: 'due_date',
		label: 'Scadenza'
	},
	{
		key: 'due_amount',
		label: 'Status',
		transform: (due_amount, invoice) => {
			var paid = due_amount === 0;
			var overdue = Date.parse(invoice.due_at) < new Date().getTime();
			if (paid) {
				return <span className="status status-green" />;
			} else if (overdue) {
				return <span className="status status-red" />;
			} else {
				return <span className="status status-yellow" />;
			}
		}
	},
	{
		key: 'client',
		label: 'Cliente',
		transform: client => {
			return client.name;
		}
	},
	{
		key: 'amount',
		label: 'Totale',
		transform: el => '€ ' + numeral(el)
	},
	{
		key: 'tax_amount',
		label: 'IVA',
		transform: el => '€ ' + numeral(el)
	},
	{
		key: 'subject',
		label: 'Soggetto'
	}
];

export default class Invoices extends Component {
	constructor() {
		super();
		this.state = {
			invoices: {},
			search: ''
		};

		this.parseInvoices = this.parseInvoices.bind(this);
	}
	componentDidMount() {
		this.setState({ invoices: InvoicesStore.data });
		InvoicesStore.on('data', this.parseInvoices);
	}

	componentWillUnmount() {
		InvoicesStore.off('data', this.parseInvoices);
	}

	parseInvoices() {
		this.setState({ invoices: InvoicesStore.data });
	}

	drawTableForYear(year) {
		const data = this.state.invoices[year];
		return (
			<div key={year}>
				<h2>{year}</h2>
				<Table data={data} columns={columns} search={this.state.search || ''} />
			</div>
		);
	}

	render() {
		if (Object.keys(this.state.invoices).length > 0) {
			let tables = [
				this.drawTableForYear(new Date().getFullYear() - 1),
				this.drawTableForYear(new Date().getFullYear())
			];
			return (
				<div className="invoices">
					<div>
						<div style={{ float: 'right' }}>
							Cerca:
							<input
								placeholder="Cerca"
								onChange={() =>
									this.setState({
										search: this.search.getValue()
									})
								}
								ref={input => (this.search = input)}
							/>
						</div>
						<div className="legend">
							<div>
								Pagata <span className="legend-item legend-green" />
							</div>
							<div>
								Scaduta <span className="legend-item legend-red" />
							</div>
							<div>
								Non-Scaduta <span className="legend-item legend-yellow" />
							</div>
						</div>
						{tables.reverse()}
					</div>
				</div>
			);
		}
		return (
			<div className="invoices">
				<Loader />
			</div>
		);
	}
}
