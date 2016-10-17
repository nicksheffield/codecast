var {http} = require('./http')
var io = require('socket.io')(http)

io.on('connection', function(socket) {
	console.log('electron', require('../electron'))
	require('../electron').mainWindow.webContents.send('user-connection', {
		id: socket.id,
		count: io.engine.clientsCount
	})
	
	socket.on('disconnect', function() {
		setTimeout(function() {
			require('../electron').mainWindow.webContents.send('user-connection', {
				id: socket.id,
				count: io.engine.clientsCount
			})
		}, 100)
	})
})


module.exports = {
	io: io
}