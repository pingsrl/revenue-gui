import React, { Component } from 'react';
import InvoicesStore from '../stores/invoices.js';

class Dashboard extends Component {
  constructor() {
    super();
    this.state = {
      invoices: []
    };

    this.parseInvoices = this.parseInvoices.bind(this);
  }
  componentDidMount() {
    InvoicesStore.on('data', this.parseInvoices);
  }

  componentWillUnmount() {
    InvoicesStore.off('data', this.parseInvoices);
  }

  parseInvoices() {
    this.setState({ invoices: InvoicesStore.data });
  }

  render() {
    return (
      <div>
      </div>
    );
  }
}

export default Dashboard;
