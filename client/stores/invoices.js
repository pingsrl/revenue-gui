import { ipcRenderer } from 'electron';
import Store from '../lib/store.js';

class InvoiceStore extends Store {
  constructor() {
    super();
    this.data = [];

    ipcRenderer.send('invoices-store-ready', {});

    ipcRenderer.on('invoices-data', (event, data) => {
      // riordino le fatture in ordine cronologico decrescente
      this.data = data.sort(function (a, b) {
        let date_a = Date.parse(a.issued_at);
        let date_b = Date.parse(b.issued_at);
        return date_a >= date_b ? -1 : 1;
      });

      this.emit('data');
    });
  }
}

window.stores = window.stores || {};
window.stores.invoice = new InvoiceStore();

export default window.stores.invoice;
