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
    transform: (el) => el.toUpperCase(),
  },
  {
    key: 'id',
    label: 'Link',
    transform: (el) => <a href="#" onClick={(e) => {
      e.preventDefault();
      shell.openExternal('https://pingsrl.harvestapp.com/invoices/' + el);
    }}>apri</a>,
  },
  {
    key: 'issued_at',
    label: 'Emissione',
  },
  {
    key: 'due_at',
    label: 'Scadenza',
  },
  {
    key: 'due_amount',
    label: 'Status',
    transform: (due_amount, invoice) => {
      var paid = due_amount === 0;
      var overdue = Date.parse(invoice.due_at) < (new Date).getTime();
      if (paid) {
        return <span className="status status-green" />;
      } else if (overdue) {
        return <span className="status status-red" />;
      } else {
        return <span className="status status-yellow" />;
      }
    },
  },
  {
    key: 'client_name',
    label: 'Cliente',
  },
  {
    key: 'amount',
    label: 'Totale',
    transform: (el) => '€ ' + numeral(el).format('€0,0.00'),
  },
  {
    key: 'tax_amount',
    label: 'IVA',
    transform: (el) => '€ ' + numeral(el).format('€0,0.00'),
  },
  {
    key: 'subject',
    label: 'Soggetto',
  },
];

class Invoices extends Component {
  constructor() {
    super();
    this.state = {
      invoices: InvoicesStore.data
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

  render() {

    let tables = [];
    for (let y in this.state.invoices) {
      tables.push(
        <div key={y}>
          <h2>{y}</h2>
          <Table data={this.state.invoices[y]} columns={columns} />
        </div>
      );
    }

    if (Object.keys(this.state.invoices).length > 0) {
      return (
        <div className="invoices">
          <div>
            <div className="legend">
              <div>Pagata <span className="legend-item legend-green" /></div>
              <div>Scaduta <span className="legend-item legend-red" /></div>
              <div>Non-Scaduta <span className="legend-item legend-yellow" /></div>
            </div>
            {tables.reverse()}
          </div>
        </div>
      );
    }
    return (<div className="invoices">
      <Loader/>
    </div>);
  }
}

export default Invoices;
