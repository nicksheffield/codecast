// ------------------------------------------------------------
//   Electron App
// ------------------------------------------------------------
var electronApp = require('electron').app
var BrowserWindow = require('electron').BrowserWindow

var service = {
	mainWindow: {
		window: null
	}
}

module.exports = service

// ------------------------------------------------------------
//   Main Application Processes
// ------------------------------------------------------------
electronApp.on('ready', function() {
	require('./menu')
	
	var screen = require('electron').screen.getPrimaryDisplay().workAreaSize
	
	var inset = 100
	
	service.mainWindow.window = new BrowserWindow({
		width: screen.width - (inset * 2),
		height: screen.height - (inset * 2),
		x: inset,
		y: inset + 25
	})
	
	service.mainWindow.window.loadURL(`file://${__dirname}/../app.html`)
	
	service.mainWindow.window.on('closed', function () {
		service.mainWindow.window = null
	})
})

electronApp.on('window-all-closed', function() {
	electronApp.quit()
})