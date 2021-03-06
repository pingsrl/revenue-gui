import { ipcRenderer } from 'electron';
import Store from '../lib/store.js';

class PaymentStore extends Store {
	constructor() {
		super();
		this.data = {};

		ipcRenderer.send('payments-store-ready', {});

		ipcRenderer.on('payments-data', (event, data) => {
			// riordino le fatture in ordine cronologico decrescente
			data.sort(function(a, b) {
				let date_a = Date.parse(a.issued_at);
				let date_b = Date.parse(b.issued_at);
				return date_a >= date_b ? -1 : 1;
			}).forEach(el => {
				let key = el.paid_at.slice(0, 4);
				this.data[key] = this.data[key] || [];
				this.data[key].push(el);
			});

			this.emit('data');
		});
	}
}

window.stores = window.stores || {};
window.stores.payment = new PaymentStore();

export default window.stores.payment;
