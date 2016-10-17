module.exports = {
	config: require('./config'),
	http: require('./http').http,
	app: require('./http').app,
	ignore: require('./ignore'),
	ipc: require('./ipc'),
	main: require('./main'),
	io: require('./sockets').io,
	mainWindow: require('../electron').mainWindow
}