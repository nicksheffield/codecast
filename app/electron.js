// ------------------------------------------------------------
//   Dependencies
// ------------------------------------------------------------
var electron      = require('electron')
var low           = require('lowdb')
var _             = require('lodash')
var mkdirp        = require('mkdirp')
var mainApp       = require('./live-file-view')
var fs            = require('fs')


// ------------------------------------------------------------
//   Electron Libs
// ------------------------------------------------------------
var app           = electron.app
var dialog        = electron.dialog
var ipcMain       = electron.ipcMain
var BrowserWindow = electron.BrowserWindow

var mainWindow


// ------------------------------------------------------------
//   Data Directory and Lowdb
// ------------------------------------------------------------
var dataDir = app.getPath('appData') + '/codecast'
if(!fs.existsSync(dataDir)) mkdirp(dataDir)
var db = low(app.getPath('appData') + '/codecast/db.json')

var homeDir = app.getPath('home').split('/')
var username = homeDir[homeDir.length-1]

db.defaults({
	username: username,
	folders: []
}).value()

console.log('dataDir', dataDir)


// ------------------------------------------------------------
//   Main Application Processes
// ------------------------------------------------------------
app.on('ready', function() {
	var screen = electron.screen.getPrimaryDisplay().workAreaSize
	
	var inset = 100
	
	mainWindow = new BrowserWindow({
		width: screen.width - (inset * 2),
		height: screen.height - (inset * 2),
		x: inset,
		y: inset + 25,
		titleBarStyle: 'hidden-inset'
	})
	
	mainWindow.loadURL(`file://${__dirname}/app.html`)
	
	mainWindow.on('closed', function () {
		mainWindow = null
	})
})

app.on('window-all-closed', function() {
	app.quit()
})


// ------------------------------------------------------------
//   Right Click Menu
// ------------------------------------------------------------
require('electron-context-menu')({

})


// ------------------------------------------------------------
//   Sockets
// ------------------------------------------------------------

mainApp.io.on('connection', function(socket) {
	mainWindow.webContents.send('user-connection', {
		id: socket.id,
		count: mainApp.io.engine.clientsCount
	})
	
	socket.on('disconnect', function() {
		mainWindow.webContents.send('user-connection', {
			id: socket.id,
			count: mainApp.io.engine.clientsCount
		})
	})
})


// ------------------------------------------------------------
//   Meta route
// ------------------------------------------------------------
mainApp.express.get('/api/meta', function(req, res) {
	res.send({
		mainFolder: mainApp.mainFolder(),
		username: low(app.getPath('appData') + '/codecast/db.json').getState().username
	})
})


// ------------------------------------------------------------
//   IPC Events
// ------------------------------------------------------------

ipcMain.on('turn-on', function(event) {
	mainApp.on()
	
	event.sender.send('turned-on')
})

ipcMain.on('turn-off', function(event) {
	mainApp.off()
	
	event.sender.send('turned-off')
})

ipcMain.on('get-status', function(event) {
	var status = mainApp.listening()
	
	event.sender.send('listening-status', status)
})

ipcMain.on('request-io-update', function(event) {
	event.sender.send('user-connection', {
		count: mainApp.io.engine.clientsCount
	})
})

ipcMain.on('open-file-dialog', function(event) {
	var window = BrowserWindow.fromWebContents(event.sender)
	var files = dialog.showOpenDialog(window, { properties: [ 'openDirectory' ]})
	
	setFolder(event, files)
})

ipcMain.on('drop-folder', function(event, path) {
	setFolder(event, [path])
})

function setFolder(event, path) {
	if(mainApp.setFolder(path)) {
		
		event.sender.send('selected-directory', path)
		
		var data = db.getState()
		data.folders = _.reject(data.folders, (folder) => folder == path[0])
		
		data.folders.push(path[0])
		db.value()
	}
}

ipcMain.on('get-folders', function(event) {
	event.sender.send('list-folders', db.getState().folders)
})