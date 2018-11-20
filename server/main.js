const { app, BrowserWindow, ipcMain } = require('electron');
const { getData } = require('./revenue.js');

let win;

function createWindow() {
	win = new BrowserWindow({
		width: 1500,
		height: 1000
	});
	win.loadFile('./static/index.html');

	// Apre il Pannello degli Strumenti di Sviluppo.
	win.webContents.openDevTools();

	win.on('closed', () => {
		// Eliminiamo il riferimento dell'oggetto window;  solitamente si tiene traccia delle finestre
		// in array se l'applicazione supporta più finestre, questo è il momento in cui
		// si dovrebbe eliminare l'elemento corrispondente.
		win = null;
	});

	ipcMain.on('invoices-store-ready', (event, args) => {
		getData('invoices').then(invoices =>
			event.sender.send('invoices-data', invoices)
		);
	});

	ipcMain.on('payments-store-ready', (event, args) => {
		getData('payments').then(payments =>
			event.sender.send('payments-data', payments)
		);
	});

	setInterval(() => {
		getData('invoices').then(invoices =>
			event.sender.send('invoices-data', invoices)
		);
		getData('payments').then(payments =>
			event.sender.send('payments-data', payments)
		);
	}, 1000 * 60 * 60 * 2);
}

app.on('ready', createWindow);

// Terminiamo l'App quando tutte le finestre vengono chiuse.
app.on('window-all-closed', () => {
	// Su macOS è comune che l'applicazione e la barra menù
	// restano attive finché l'utente non esce espressamente tramite i tasti Cmd + Q
	if (process.platform !== 'darwin') {
		app.quit();
	}
});

app.on('activate', () => {
	// Su macOS è comune ri-creare la finestra dell'app quando
	// viene cliccata l'icona sul dock e non ci sono altre finestre aperte.
	if (win === null) {
		createWindow();
	}
});
