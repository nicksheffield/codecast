var {mainWindow} = require('./central')

module.exports = function(io, socket) {
	
	io.on('connection', function(socket) {
		mainWindow.window.webContents.send('user-connection', {
			id: socket.id,
			count: io.engine.clientsCount
		})
		
		socket.on('disconnect', function() {
			setTimeout(function() {
				mainWindow.window.webContents.send('user-connection', {
					id: socket.id,
					count: io.engine.clientsCount
				})
			}, 100)
		})
	})
	
}