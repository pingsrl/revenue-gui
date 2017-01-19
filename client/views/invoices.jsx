import React, { Component } from 'react';
import InvoicesStore from '../stores/invoices.js';
import numeral from '../lib/numeral.js';
import Table from '../components/table.jsx';

let columns = [
  {
    key: 'purchase_order',
    label: '#',
    transform: (el) => el.toUpperCase(),
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
    key: 'client_name',
    label: 'Cliente',
  },
  {
    key: 'amount',
    label: 'Ammontare',
    transform: (el) => '€ ' + numeral(el).format('€0,0.00'),
  },
  {
    key: 'tax_amount',
    label: 'Tasse',
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

    return (
      <div className="invoices">
        {Object.keys(this.state.invoices).length > 0 ? tables.reverse() : <div>Dati in caricamento...</div>}
      </div>
    );
  }
}

export default Invoices;
