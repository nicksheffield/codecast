module.exports = {
	config:     require('./config').config,
	mainWindow: require('./window').mainWindow,
	http:       require('./http').http,
	ignore:     require('./ignore').ignore,
	ipc:        require('./ipc'),
	io:         require('./sockets').io,
	main:       require('./main').main
}