// ------------------------------------------------------------
// Dependencies
var _ = require('lodash')
var io = require('socket.io')
var express = require('express')
var bodyParser = require('body-parser')
var evilscan = require('evilscan')


// ------------------------------------------------------------
// Setup central
var central = require('./electron/central')
central.memory = { broadcasting: false }
central.ignore = require('./electron/ignore').ignore


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
var {ipc} = require('./electron/ipc')


// ------------------------------------------------------------
// Start HTTP/Socket.IO server
var port = 3000
var range = 0

var matches = []

var options = {
	target: '127.0.0.1',
	port: port + '-' + (port + range),
	status: 'TROU', // Timeout, Refused, Open, Unreachable
	banner: true
}

var scanner = new evilscan(options)

scanner.on('result',function(data) {
	matches.push(data)
});

scanner.on('error',function(err) {
	throw new Error(err.toString());
});

scanner.on('done',function() {
	
	var m = _.find(matches, function(match) {
		return match.status == 'closed (refused)'
	})
	
	console.log('Listening on port', m.port)
	server.listen(m.port)
});

scanner.run();
