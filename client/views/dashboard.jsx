import React, { Component } from 'react';
import InvoicesStore from '../stores/invoices.js';
import _ from 'lodash';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip
} from 'Recharts';
import { ButtonGroup, Button } from 'react-photonkit';
import CustomToolTip from '../components/tooltip.jsx';

class Dashboard extends Component {
  constructor() {
    super();
    this.state = {
      invoices: {},
      year: (new Date).getFullYear(),
    };

    this.parseInvoices = this.parseInvoices.bind(this);
    this.getBarData = this.getBarData.bind(this);
    this.setYear = this.setYear.bind(this);
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

  getBarData() {
    let data = [];
    let invoices = this.state.invoices[this.state.year];
    if (!invoices) {
      return data;
    }

    let groups = _.groupBy(invoices, (el) => {
      return el.issued_at.slice(5, 7)
    });

    ['01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12'].forEach((m) => {
      data.push({
        label: m,
        value: !groups[m] ? 0 : Math.round(groups[m].reduce((a, b) => {
          return (a.amount - a.tax_amount || a) + b.amount - b.tax_amount;
        }))
      })
    });

    return data.sort((a, b) => a.label > b.label ? 1 : -1);
  }

  setYear(el) {
    this.setState({ year: el });
  }

  render() {
    return (
      <div>
        {Object.keys(this.state.invoices).length > 0 ?
          <div style={{ textAlign: 'center' }}>
            <ButtonGroup>
              {Object.keys(this.state.invoices).map((el) =>
                <Button key={el} text={el} onClick={this.setYear.bind(this, el)}></Button>
              )}
            </ButtonGroup>
            <h3>{this.state.year}</h3>
            <BarChart width={800} height={300} data={this.getBarData()}>
              <XAxis dataKey="label" />
              <YAxis />
              <Tooltip content={<CustomToolTip />} />
              <Bar dataKey='value' fill='#008fff' />
            </BarChart>
          </div> :
          <div>Dati in caricamento...</div>}

      </div>
    );
  }
}

export default Dashboard;
