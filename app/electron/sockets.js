var io = require('socket.io')()

var service = {
	io: io
}

module.exports = service

var {http, mainWindow} = require('./central')

console.log('central', require('./central'))

service.io.attach(http)

service.io.on('connection', function(socket) {
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