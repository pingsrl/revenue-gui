var _ = require('lodash');

module.exports = function formatNumber(num = 0) {
	return _.padStart(
		num.toLocaleString(undefined, {
			maximumFractionDigits: 2,
			minimumFractionDigits: 2
		}),
		9
	);
};
