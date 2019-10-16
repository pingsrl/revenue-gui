import React, { Component } from 'react';
import _ from 'lodash';
import {
	ComposedChart,
	Bar,
	Line,
	XAxis,
	YAxis,
	Tooltip,
	Legend,
	CartesianGrid
} from 'Recharts';
import months from '../lib/months.json';

import InvoicesStore from '../stores/invoices.js';
import PaymentsStore from '../stores/payments.js';

import CustomToolTip from '../components/tooltip.jsx';
import Table from '../components/table.jsx';
import Loader from '../components/loader.jsx';

const numeral = require('../lib/numeral.js');

let columns = [
	{
		key: 'label',
		label: 'Mese',
		transform: el => months[parseInt(el, 10) - 1]
	},
	{
		key: 'invoiced',
		label: 'Fatturato',
		transform: el => '€ ' + numeral(el)
	},
	{
		key: 'paid',
		label: 'Incassato',
		transform: el => '€ ' + numeral(el)
	},
	{
		key: 'vat_paid',
		label: 'IVA Incassato',
		transform: (el, month) => '€ ' + numeral(month.paid * 0.22)
	}
];

export default class Dashboard extends Component {
	constructor() {
		super();
		this.state = {
			invoices: {},
			payments: {},
			year: new Date().getFullYear()
		};

		this.parseInvoices = this.parseInvoices.bind(this);
		this.parsePayments = this.parsePayments.bind(this);
		this.getBarData = this.getBarData.bind(this);
		this.setYear = this.setYear.bind(this);
	}
	componentDidMount() {
		this.setState({
			invoices: InvoicesStore.data,
			payments: PaymentsStore.data
		});
		InvoicesStore.on('data', this.parseInvoices);
		PaymentsStore.on('data', this.parsePayments);
	}

	componentWillUnmount() {
		InvoicesStore.off('data', this.parseInvoices);
		PaymentsStore.off('data', this.parsePayments);
	}

	parseInvoices() {
		this.setState({ invoices: InvoicesStore.data });
	}

	parsePayments() {
		this.setState({ payments: PaymentsStore.data });
	}

	calcPercentage(y1 = 0, y2 = 0) {
		return ((y2 - y1) / y1) * 100;
	}

	getBarData(year) {
		let data = [];
		let invoices = this.state.invoices[year];
		let payments = this.state.payments[year];

		if (!invoices || !payments) {
			return data;
		}

		let invoiceGroups = _.groupBy(invoices, el => {
			return el.issue_date.slice(5, 7);
		});

		let paymentGroups = _.groupBy(payments, el => {
			return el.paid_date.slice(5, 7);
		});

		[
			'01',
			'02',
			'03',
			'04',
			'05',
			'06',
			'07',
			'08',
			'09',
			'10',
			'11',
			'12'
		].forEach((m, idx) => {
			let invoiced = 0;
			let paid = 0;
			let invoiced_to_date = 0;
			let paid_to_date = 0;

			// sommo le fatture
			if (invoiceGroups[m]) {
				invoiced = invoiceGroups[m]
					.map(a => a.amount - a.tax_amount)
					.reduce((a, b) => a + b);
			}

			// sommo i pagamenti
			if (paymentGroups[m]) {
				paid = paymentGroups[m].map(a => a.amount).reduce((a, b) => a + b);
			}

			if (year != this.state.year && m == new Date().getMonth() + 1) {
				const invoices_to_date = invoiceGroups[m].filter(
					el => el.issue_date.slice(8) <= new Date().getDate()
				);

				invoiced_to_date = invoices_to_date
					.map(a => a.amount - a.tax_amount)
					.reduce((a, b) => a + b, 0);

				paid_to_date = invoices_to_date
					.map(a => a.amount)
					.reduce((a, b) => a + b, 0);
			}

			data.push({
				label: m,
				invoiced,
				paid,
				invoiced_to_date,
				paid_to_date
			});
		});

		return data.sort((a, b) => (a.label > b.label ? 1 : -1));
	}

	setYear(el) {
		this.setState({ year: el });
	}

	render() {
		let oldData = this.getBarData(this.state.year - 1);
		let data = this.getBarData(this.state.year).map((m, i) => {
			if (oldData[i]) {
				return {
					label: m.label,
					invoiced: m.invoiced,
					paid: m.paid,
					invoiced_last_year: oldData[i].invoiced,
					paid_last_year: oldData[i].paid,
					invoiced_last_year_to_date: oldData[i].invoiced_to_date,
					paid_last_year_to_date: oldData[i].paid_to_date
				};
			}
			return m;
		});

		if (
			Object.keys(this.state.invoices).length > 0 &&
			Object.keys(this.state.payments).length > 0
		) {
			var invoiced = data.map(a => a.invoiced).reduce((a, b) => a + b);

			var invoiced_last_year = data
				.filter(el => {
					if (this.state.year == new Date().getFullYear()) {
						return parseInt(el.label, 10) <= new Date().getMonth() + 1;
					}
					return true;
				})
				.map(a => a.invoiced_last_year_to_date || a.invoiced_last_year)
				.reduce((a, b) => a + b);

			var diff = this.calcPercentage(invoiced_last_year, invoiced);

			return (
				<div className="dashboard">
					<div style={{ textAlign: 'center' }}>
						<btn-group type="absolute">
							{Object.keys(this.state.invoices).map(el => {
								let className = 'btn btn-segment';
								if (this.state.year == parseInt(el, 10)) {
									className += ' active';
								}
								return (
									<button
										key={el}
										className={className}
										onClick={this.setYear.bind(this, el)}
									>
										{el}
									</button>
								);
							})}
						</btn-group>
						<h4>
							Fatturato {this.state.year}: € {numeral(invoiced)}
							<span className={diff > 0 ? 'positive' : 'negative'}>
								{diff > 0 && '+'}
								{numeral(diff)}%
							</span>
						</h4>
						<ComposedChart width={1000} height={500} data={data}>
							<CartesianGrid strokeDasharray="3 3" />
							<XAxis dataKey="label" />
							<YAxis />
							<Tooltip content={<CustomToolTip />} />
							<Bar dataKey="invoiced" fill="#60beeb" />
							<Bar dataKey="paid" fill="#8cc759" />
							<Legend />
							<Line
								type="monotone"
								dataKey="invoiced_last_year"
								stroke="#ef5d74"
							/>
						</ComposedChart>
						<Table data={data} columns={columns} />
					</div>
				</div>
			);
		}

		return (
			<div className="dashboard">
				<Loader />
			</div>
		);
	}
}
