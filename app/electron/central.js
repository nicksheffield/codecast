module.exports = {
	config: require('./config').config,
	http: require('./http').http,
	app: require('./http').app,
	ignore: require('./ignore').ignore,
	ipc: require('./ipc'),
	main: require('./main').main,
	io: require('./sockets').io,
	mainWindow: require('./window').mainWindow
}