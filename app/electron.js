// ------------------------------------------------------------
//   Electron App
// ------------------------------------------------------------
var electronApp = require('electron').app
var BrowserWindow = require('electron').BrowserWindow

var mainWindow


// ------------------------------------------------------------
//   Libs
// ------------------------------------------------------------
const {main, config} = require('./electron/central')


// ------------------------------------------------------------
//   Main Application Processes
// ------------------------------------------------------------
electronApp.on('ready', function() {
	require('./electron/menu')
	
	var screen = require('electron').screen.getPrimaryDisplay().workAreaSize
	
	var inset = 100
	
	mainWindow = new BrowserWindow({
		width: screen.width - (inset * 2),
		height: screen.height - (inset * 2),
		x: inset,
		y: inset + 25
	})
	
	mainWindow.loadURL(`file://${__dirname}/app.html`)
	
	mainWindow.on('closed', function () {
		mainWindow = null
	})
	
	if(config.get('currentFolder')) {
		main.setFolder(config.get('currentFolder').path)
	}
})

electronApp.on('window-all-closed', function() {
	electronApp.quit()
})


module.exports = {
	mainWindow: mainWindow
}