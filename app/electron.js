// ------------------------------------------------------------
// Setup central
const central = require('./electron/central')
central.memory = { broadcasting: false }
central.ignore = require('./electron/ignore').ignore


// ------------------------------------------------------------
// Setup config
const {config} = require('./electron/config')
central.config = config


// ------------------------------------------------------------
// Setup Electron window
const {mainWindow} = require('./electron/window')
central.mainWindow = mainWindow


// ------------------------------------------------------------
// Setup Express server
const expressApp = require('express')()
const server = require('http').Server(expressApp)

central.server = server
central.expressApp = expressApp

expressApp.use(require('body-parser').json())
expressApp.use(require('body-parser').urlencoded({ extended: true }))

expressApp.use('/api', require('./electron/http'))


// ------------------------------------------------------------
// Setup Socket.IO server
const io = require('socket.io')(server)
central.io = io

io.on('connection', function(socket) {
	require('./electron/sockets')(io, socket)
})


// ------------------------------------------------------------
// Setup Folder
const {folder} = require('./electron/folder')
central.folder = folder

if(config.get('currentFolder')) {
	folder.setFolder(config.get('currentFolder').path)
}


// ------------------------------------------------------------
// Setup IPC
const {ipc} = require('./electron/ipc')


// ------------------------------------------------------------
// Start HTTP/Socket.IO server
const {scan} = require('./electron/scan')