import React, { Component } from 'react';

class Table extends Component {
  elementParser() {
    return this.props.data.map((el) =>
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


  render() {
    return (
      <table className="table-striped">
        <thead>
          <tr>
            {this.props.columns.map((el) =>
              <td key={el.key||el} className={el.key||el}>{el.label || el}</td>
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
