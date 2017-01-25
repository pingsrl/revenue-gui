const {
  app,
  BrowserWindow,
  ipcMain
} = require('electron');
const {
  getData
} = require('./revenue.js');

let win;

app.on('ready', () => {
  win = new BrowserWindow({
    width: 1500,
    height: 1000
  });
  win.loadURL('file://' + __dirname + '/static/index.html');

  ipcMain.on('invoices-store-ready', (event, args) => {
    getData('invoices').then((invoices) => event.sender.send('invoices-data', invoices));
  });

  ipcMain.on('payments-store-ready', (event, args) => {
    getData('payments').then((payments) => event.sender.send('payments-data', payments));
  });

  setInterval(() => {
    getData('invoices').then((invoices) => event.sender.send('invoices-data', invoices));
    getData('payments').then((payments) => event.sender.send('payments-data', payments));
  }, 1000 * 60 * 60 * 2);
});
