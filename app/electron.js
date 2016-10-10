// ------------------------------------------------------------
//   Dependencies
// ------------------------------------------------------------
var electron      = require('electron')
var low           = require('lowdb')
var _             = require('lodash')
var mkdirp        = require('mkdirp')
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
var db = low(dataDir + '/db.json')
db.defaults({ folders: [] }).value()

console.log('dataDir', dataDir)


// ------------------------------------------------------------
//   Main Application Processes
// ------------------------------------------------------------
app.on('ready', function() {
	mainWindow = new BrowserWindow({width: 800, height: 600})
	mainWindow.loadURL(`file://${__dirname}/app.html`)
	mainWindow.on('closed', function () {
		mainWindow = null
	})
})

app.on('window-all-closed', function() {
	app.quit()
})