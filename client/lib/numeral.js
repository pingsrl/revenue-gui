import numeral from 'numeral';

numeral.register('locale', 'it', {
	delimiters: {
		thousands: '.',
		decimal: ','
	},
	abbreviations: {
		thousand: 'k',
		million: 'm',
		billion: 'b',
		trillion: 't'
	},
	ordinal: function(number) {
		return number === 1 ? 'mo' : 'mi';
	},
	currency: {
		symbol: '€'
	}
});

numeral.locale('it');

export default numeral;
