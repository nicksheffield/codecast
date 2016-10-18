// ------------------------------------------------------------
// Dependencies
var _ = require('lodash')
var io = require('socket.io')
var express = require('express')
var bodyParser = require('body-parser')


// ------------------------------------------------------------
// Setup central
var central = require('./electron/central')
central.memory = { broadcasting: false }


// ------------------------------------------------------------
// Setup config
var {config} = require('./electron/config')
central.config = config


// ------------------------------------------------------------
// Setup Electron window
var {mainWindow} = require('./electron/window')
central.mainWindow = mainWindow


// ------------------------------------------------------------
// Setup Express server
var expressApp = express()
var server = require('http').Server(expressApp)

central.server = server
central.expressApp = expressApp

expressApp.use(bodyParser.json())
expressApp.use(bodyParser.urlencoded({ extended: true }))

expressApp.use('/api', require('./electron/http'))


// ------------------------------------------------------------
// Setup Socket.IO server
var io = require('socket.io')(server)
central.io = io

io.on('connection', function(socket) {
	require('./electron/sockets')(io, socket)
})


// ------------------------------------------------------------
// Setup Folder
var {folder} = require('./electron/folder')
central.folder = folder

if(config.get('currentFolder')) {
	folder.setFolder(config.get('currentFolder').path)
}


// ------------------------------------------------------------
// Setup IPC
require('./electron/ipc')


// ------------------------------------------------------------
// Start HTTP/Socket.IO server
server.listen(3000)