import { ipcRenderer } from 'electron';
import Store from '../lib/store.js';

class InvoiceStore extends Store {
	constructor() {
		super();
		this.data = {};

		ipcRenderer.send('invoices-store-ready', {});

		ipcRenderer.on('invoices-data', (event, data) => {
			// riordino le fatture in ordine cronologico decrescente
			data
				.sort(function(a, b) {
					let date_a = Date.parse(a.issue_date);
					let date_b = Date.parse(b.issue_date);
					return date_a >= date_b ? -1 : 1;
				})
				.forEach(el => {
					let key = el.issue_date.slice(0, 4);
					this.data[key] = this.data[key] || [];
					this.data[key].push(el);
				});

			this.emit('data');
		});
	}
}

window.stores = window.stores || {};
window.stores.invoice = new InvoiceStore();

export default window.stores.invoice;
