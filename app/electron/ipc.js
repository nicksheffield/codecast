const {ipcMain, app, dialog, BrowserWindow} = require('electron')
const _ = require('lodash')
const fs = require('fs')

const {io, folder, memory, config} = require('./central')

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
	
	if(files) {
		folder.setFolder(files[0] + '/', event)
	}
})

ipcMain.on('drop-folder', function(event, path) {
	folder.setFolder(path, event)
})

ipcMain.on('config-change', function(event) {
	config.refresh()
})

module.exports = {
	ipc: ipcMain
}