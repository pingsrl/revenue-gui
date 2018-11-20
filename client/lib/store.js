import { EventEmitter } from 'events';

export default class Emitter extends EventEmitter {
	off(event, func) {
		this.removeListener(event, func);
	}

	isNumeric(obj) {
		return !_.isArray(obj) && obj - parseFloat(obj) + 1 >= 0;
	}
}
