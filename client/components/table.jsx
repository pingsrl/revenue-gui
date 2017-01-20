import React, { Component } from 'react';

class Table extends Component {
  constructor(props) {
    super();
    this.state = {
      data: props.data,
      order: {
        key: '',
        direction: 1,
      },
      search: '',
    };
  }
  componentWillReceiveProps(nextProps) {
    this.setState({
      data: nextProps.data,
      order: {
        key: '',
        direction: 1,
      },
      search: nextProps.search.trim().toLowerCase(),
    });
  }

  elementParser() {
    let data = this.state.data;

    if (this.state.search.length > 2) {
      data = data.filter((el) => {
        for (let i = 0; i < this.props.columns.length; i++) {
          let column = this.props.columns[i];
          if (el[column.key].indexOf && el[column.key].toLowerCase().indexOf(this.state.search) > -1) {
            return true;
          }
        }
        return false;
      });
    }

    return data.map((el) =>
      <tr key={el.id}>
        {this.props.columns.map((col) => {
          let key = col.key || col;
          let value = el[key];
          if (col.transform) {
            value = col.transform(value, el);
          }
          return <td key={key} className={key}>{value}</td>;
        }
        )}
      </tr>
    );
  }

  orderBy(key) {
    this.setState({
      data: this.state.data.sort((a, b) => {
        if (a[key] < b[key]) return -1 * this.state.order.direction;
        if (a[key] > b[key]) return 1 * this.state.order.direction;
        return 0;
      }),
      order: {
        key,
        direction: this.state.order.key === key ? this.state.order.direction * -1 : -1,
      },
    });
  }

  render() {
    return (
      <table className="table-striped">
        <thead>
          <tr>
            {this.props.columns.map((el) =>
              <td key={el.key || el} className={el.key || el} onClick={this.orderBy.bind(this, el.key)}>
                {el.label || el}
                {el.key === this.state.order.key ? <span className={this.state.order.direction > 0 ? 'table-triangle-up' : 'table-triangle-down'}></span> : null}
              </td>
            )}
          </tr>
        </thead>
        <tbody>
          {this.elementParser()}
        </tbody>
      </table>
    );
  }
}

export default Table;
