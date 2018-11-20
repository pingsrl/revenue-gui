import React, { Component } from 'react';
import numeral from '../lib/numeral.js';
import months from '../lib/months.json';

class Tooltip extends Component {
	calcPercentage(y1 = 0, y2 = 0) {
		var perc = ((y2 - y1) / y1) * 100;
		var str = numeral(perc).format('0.00');
		return (
			<span className={perc > 0 ? 'positive' : 'negative'}>
				{perc > 0 ? '+' + str : str}%
			</span>
		);
	}

	render() {
		const { active } = this.props;

		if (active) {
			const { payload, label } = this.props;
			return (
				<div className="custom-tooltip">
					<p className="label">{months[parseInt(label, 10) - 1]}</p>
					<p className="label">
						<span className="name">Fatturato:</span>
						<span className="number">
							€ {numeral(payload[0].value).format('€0,0.00')}
						</span>
						<span className="percentage">
							{this.calcPercentage(
								payload[2].value,
								payload[0].value
							)}
						</span>
					</p>
					<p className="label">
						<span className="name">Incassato:</span>
						<span className="number">
							€ {numeral(payload[1].value).format('€0,0.00')}
						</span>
						<span className="percentage"> </span>
					</p>
				</div>
			);
		}

		return null;
	}
}

export default Tooltip;
