const {ipcMain, app} = require('electron')
const _ = require('lodash')
const fs = require('fs')

const {io, folder, memory} = require('./central')

ipcMain.on('turn-on', function(event) {
	memory.broadcasting = true
	
	event.sender.send('turned-on')
})

ipcMain.on('turn-off', function(event) {
	memory.broadcasting = false
	
	event.sender.send('turned-off')
})

ipcMain.on('get-status', function(event) {
	event.sender.send('listening-status', memory.broadcasting)
})

ipcMain.on('get-version', function(event) {
	event.sender.send('version', app.getVersion())
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
	folder.clearFolder()
})

ipcMain.on('open-file-dialog', function(event) {
	var window = BrowserWindow.fromWebContents(event.sender)
	var files = dialog.showOpenDialog(window, { properties: [ 'openDirectory' ]})
	
	folder.setFolder(files[0] + '/', event)
})

ipcMain.on('drop-folder', function(event, path) {
	folder.setFolder(path, event)
})

module.exports = {
	ipc: ipcMain
}