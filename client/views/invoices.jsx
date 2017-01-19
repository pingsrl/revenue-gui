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
    transform: (el) => numeral(el).format('€0,0.00'),
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
    let years = {};

    this.state.invoices.forEach((el) => {
      let key = el.issued_at.slice(0, 4);
      years[key] = years[key] || [];
      years[key].push(el);
    });

    let tables = [];
    for (let y in years) {
      tables.push(
        <div key={y}>
          <h2>{y}</h2>
          <Table data={years[y]} columns={columns} />
        </div>
      );
    }

    return (
      <div className="invoices">
        {this.state.invoices.length > 0 ?  tables.reverse() : <div>Dati in caricamento...</div>}
      </div>
    );
  }
}

export default Invoices;
