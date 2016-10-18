var socketio = require('socket.io')

var service = {
	io: null
}

module.exports = service

var {http} = require('./http')
var {mainWindow} = require('./window')
service.io = socketio(http)

service.io.on('connection', function(socket) {
	console.log('electron', require('../electron'))
	require('../electron').mainWindow.webContents.send('user-connection', {
		id: socket.id,
		count: service.io.engine.clientsCount
	})
	
	socket.on('disconnect', function() {
		setTimeout(function() {
			require('../electron').mainWindow.webContents.send('user-connection', {
				id: socket.id,
				count: service.io.engine.clientsCount
			})
		}, 100)
	})
})