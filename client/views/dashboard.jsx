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
import { ButtonGroup, Button } from 'react-photonkit';

import numeral from '../lib/numeral.js';
import months from '../lib/months.js';

import InvoicesStore from '../stores/invoices.js';
import PaymentsStore from '../stores/payments.js';

import CustomToolTip from '../components/tooltip.jsx';
import Table from '../components/table.jsx';
import Loader from '../components/loader.jsx';

let columns = [
	{
		key: 'label',
		label: 'Mese',
		transform: el => months[parseInt(el, 10) - 1]
	},
	{
		key: 'invoiced',
		label: 'Fatturato',
		transform: el => '€' + numeral(el).format('0,0.00')
	},
	{
		key: 'paid',
		label: 'Incassato',
		transform: el => '€' + numeral(el).format('0,0.00')
	},
	{
		key: 'vat_paid',
		label: 'IVA Incassato',
		transform: (el, month) =>
			'€' + numeral(month.paid * 0.22).format('0,0.00')
	}
];

class Dashboard extends Component {
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

	getBarData(year = this.state.year) {
		let data = [];
		let invoices = this.state.invoices[year];
		let payments = this.state.payments[year];

		if (!invoices || !payments) {
			return data;
		}

		let invoiceGroups = _.groupBy(invoices, el => {
			return el.issued_at.slice(5, 7);
		});

		let paymentGroups = _.groupBy(payments, el => {
			return el.paid_at.slice(5, 7);
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
			// sommo le fatture
			var invoiced = !invoiceGroups[m]
				? 0
				: invoiceGroups[m]
						.map(a => a.amount - a.tax_amount)
						.reduce((a, b) => a + b);
			// sommo i pagamenti
			var paid = !paymentGroups[m]
				? 0
				: paymentGroups[m].map(a => a.amount).reduce((a, b) => a + b);

			var oldData = this.getBarData(year - 1);
			var invoiced_last_year = 0;
			var paid_last_year = 0;
			if (oldData.length) {
				invoiced_last_year = oldData[idx].invoiced;
				paid_last_year = oldData[idx].paid;
			}

			data.push({
				label: m,
				invoiced,
				paid,
				invoiced_last_year,
				paid_last_year
			});
		});

		return data.sort((a, b) => (a.label > b.label ? 1 : -1));
	}

	setYear(el) {
		this.setState({ year: el });
	}

	render() {
		var data = this.getBarData();

		if (
			Object.keys(this.state.invoices).length > 0 &&
			Object.keys(this.state.payments).length > 0
		) {
			var invoiced = data.map(a => a.invoiced).reduce((a, b) => a + b);

			var invoiced_last_year = data
				.filter(el => {
					if (this.state.year == new Date().getFullYear()) {
						return (
							parseInt(el.label, 10) <= new Date().getMonth() + 1
						);
					}
					return true;
				})
				.map(a => a.invoiced_last_year)
				.reduce((a, b) => a + b);

			var diff = this.calcPercentage(invoiced_last_year, invoiced);

			return (
				<div className="dashboard">
					<div style={{ textAlign: 'center' }}>
						<ButtonGroup>
							{Object.keys(this.state.invoices).map(el => (
								<Button
									key={el}
									text={el}
									onClick={this.setYear.bind(this, el)}
								/>
							))}
						</ButtonGroup>
						<h4>
							Fatturato {this.state.year}: €{' '}
							{numeral(invoiced).format('0,0.00')}{' '}
							<span
								className={diff > 0 ? 'positive' : 'negative'}
							>
								{diff > 0 && '+'}
								{numeral(diff).format('0,0.00')}%
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

export default Dashboard;
