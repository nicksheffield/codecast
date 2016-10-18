const {ipcMain} = require('electron')
const _ = require('lodash')
const fs = require('fs')

const {io} = require('./sockets')
const {main} = require('./main')

ipcMain.on('turn-on', function(event) {
	main.on()
	
	event.sender.send('turned-on')
})

ipcMain.on('turn-off', function(event) {
	main.off()
	
	event.sender.send('turned-off')
})

ipcMain.on('get-status', function(event) {
	var status = main.listening()
	
	event.sender.send('listening-status', status)
})

ipcMain.on('get-package', function(event) {
	event.sender.send('got-package', JSON.parse(fs.readFileSync('./app/package.json', "utf8")))
})

ipcMain.on('request-io-update', function(event) {
	event.sender.send('user-connection', {
		count: io.engine.clientsCount
	})
})

ipcMain.on('open-error-dialog', function (event, data) {
	dialog.showErrorBox(data.title, data.message)
})

ipcMain.on('clear-folder', function(event, path) {
	main.clearFolder()
})

ipcMain.on('open-file-dialog', function(event) {
	var window = BrowserWindow.fromWebContents(event.sender)
	var files = dialog.showOpenDialog(window, { properties: [ 'openDirectory' ]})
	
	main.setFolder(files[0] + '/', event)
})

ipcMain.on('drop-folder', function(event, path) {
	// setFolder(event, path)
	main.setFolder(path, event)
})

function setFolder(event, path) {
	
	if(main.setFolder(path)) {
		
		event.sender.send('selected-directory', folder)
		
		var history = config.get('history')
		
		history = _.reject(history, (f) => f.path == path)
		
		history.unshift(folder)
		
		config.set('history', history)
	}
}