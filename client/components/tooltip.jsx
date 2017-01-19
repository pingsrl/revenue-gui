import React, {Component} from 'react';
import numeral from '../lib/numeral.js';
import months from '../lib/months.js';

class Tooltip extends Component {
  render() {
    const { active } = this.props;

    if (active) {
      const { payload, label } = this.props;
      return (
        <div className="custom-tooltip">
          <p className="label">{`${months[parseInt(label,10)-1]} : €${numeral(payload[0].value).format('€0,0.00')}`}</p>
        </div>
      );
    }

    return null;
  }
}

export default Tooltip;
