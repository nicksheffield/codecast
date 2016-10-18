// ------------------------------------------------------------
//   Electron App
// ------------------------------------------------------------
var electronApp = require('electron').app
var BrowserWindow = require('electron').BrowserWindow

var service = {
	mainWindow: null
}

module.exports = service


// ------------------------------------------------------------
//   Libs
// ------------------------------------------------------------
// const {main, config} = require('./electron/central')
const {main} = require('./main')
const {config} = require('./config')


// ------------------------------------------------------------
//   Main Application Processes
// ------------------------------------------------------------
electronApp.on('ready', function() {
	require('./menu')
	
	var screen = require('electron').screen.getPrimaryDisplay().workAreaSize
	
	var inset = 100
	
	service.mainWindow = new BrowserWindow({
		width: screen.width - (inset * 2),
		height: screen.height - (inset * 2),
		x: inset,
		y: inset + 25
	})
	
	service.mainWindow.loadURL(`file://${__dirname}/../app.html`)
	
	service.mainWindow.on('closed', function () {
		service.mainWindow = null
	})
	
	if(config.get('currentFolder')) {
		main.setFolder(config.get('currentFolder').path)
	}
})

electronApp.on('window-all-closed', function() {
	electronApp.quit()
})