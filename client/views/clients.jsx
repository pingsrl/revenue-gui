import React, { Component } from 'react';
import _ from 'lodash';
import { Input } from 'react-photonkit';

import InvoicesStore from '../stores/invoices.js';
import PaymentsStore from '../stores/payments.js';

import numeral from '../lib/numeral.js';

import Table from '../components/table.jsx';
import Loader from '../components/loader.jsx';

let transform = (el) => <span >€ {numeral(el).format('€0,0.00')} </span>

let columns = [
  {
    key: 'name',
    label: 'Soggetto',
  },
  {
    key: (new Date).getFullYear() - 3,
    label: (new Date).getFullYear() - 3,
    transform
  },
  {
    key: (new Date).getFullYear() - 2,
    label: (new Date).getFullYear() - 2,
    transform
  },
  {
    key: (new Date).getFullYear() - 1,
    label: (new Date).getFullYear() - 1,
    transform
  },
  {
    key: (new Date).getFullYear(),
    label: (new Date).getFullYear(),
    transform
  },
  {
    key: 'total',
    label: 'Totale',
    transform
  },
  {
    key: 'due',
    label: 'Esposizione',
    transform
  },
];

class Clients extends Component {
  constructor() {
    super();
    this.state = {
      invoices: {},
      payments: {},
      year: (new Date).getFullYear(),
      search: '',
    };

    this.parseInvoices = this.parseInvoices.bind(this);
    this.parsePayments = this.parsePayments.bind(this);
  }
  componentDidMount() {
    this.setState({
      invoices: InvoicesStore.data,
      payments: PaymentsStore.data,
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

  getInvoicesByClient() {
    let invoices = {};
    for (let y in this.state.invoices) {
      let invoiceByClient = _.groupBy(this.state.invoices[y], (el) => {
        return el.client_name;
      });

      for (let client in invoiceByClient) {
        invoices[client] = invoices[client] || {};
        invoices[client][y] = invoices[client][y] || [];
        invoices[client][y] = invoices[client][y].concat(invoiceByClient[client]);
      }
    }
    return invoices;
  }

  render() {

    if (Object.keys(this.state.invoices).length > 0) {
      var invoices = this.getInvoicesByClient();

      let data = [];
      for (let client in invoices) {
        let row = {
          name: client,
          total: 0,
          due: 0,
        };

        for (let y in invoices[client]) {
          row[y] = invoices[client][y]
            .map(a => a.amount - a.tax_amount)
            .reduce((a, b) => a + b);

          row.due = invoices[client][y]
            .map(a => a.due_amount)
            .reduce((a, b) => a + b);

          row.total += row[y];
        }

        data.push(row);
      }

      data.sort((a, b) => a.total > b.total ? -1 : 1);

      return (
        <div className="clients">
          <div style={{ float: 'right' }}>
            Cerca:
              <Input
              placeholder="Cerca"
              onChange={() => this.setState({ search: this.search.getValue() })}
              ref={input => this.search = input}
            />
          </div>
          <h3>Performance Clienti</h3>
          <Table data={data} columns={columns} search={this.state.search || ''}/>
        </div>
      );
    }

    return (<div className="clients">
      <Loader />
    </div>);
  }
}



export default Clients;
