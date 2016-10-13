// ------------------------------------------------------------
//   Dependencies
// ------------------------------------------------------------
var electron      = require('electron')
var _             = require('lodash')
var mainApp       = require('./live-file-view')
var fs            = require('fs')
var package       = require('../package.json')
var Config        = require('electron-config')
var config        = new Config()


// ------------------------------------------------------------
//   Electron Libs
// ------------------------------------------------------------
var app           = electron.app
var dialog        = electron.dialog
var ipcMain       = electron.ipcMain
var BrowserWindow = electron.BrowserWindow
var Menu          = electron.Menu

var mainWindow


// ------------------------------------------------------------
//   Config stuff
// ------------------------------------------------------------
console.log('config:', config.path)

if(!config.get('username')) {
	config.set('username', app.getPath('home').replace('/Users/', ''))
}

if(config.get('currentFolder')) {
	mainApp.setFolder(config.get('currentFolder'))
}


// ------------------------------------------------------------
//   Main Application Processes
// ------------------------------------------------------------
app.on('ready', function() {
	var screen = electron.screen.getPrimaryDisplay().workAreaSize
	
	var inset = 100
	
	mainWindow = new BrowserWindow({
		width: screen.width - (inset * 2),
		height: screen.height - (inset * 2),
		x: inset,
		y: inset + 25,
		//titleBarStyle: 'hidden-inset'
	})
	
	mainWindow.loadURL(`file://${__dirname}/app.html`)
	
	// mainWindow.webContents.toggleDevTools()
	// require('devtron').install()
	
	mainWindow.on('closed', function () {
		mainWindow = null
	})

	var template = [
		{
			label: 'Edit',
			submenu: [
				{
					role: 'undo'
				},
				{
					role: 'redo'
				},
				{
					type: 'separator'
				},
				{
					role: 'cut'
				},
				{
					role: 'copy'
				},
				{
					role: 'paste'
				},
				{
					role: 'pasteandmatchstyle'
				},
				{
					role: 'delete'
				},
				{
					role: 'selectall'
				}
			]
		},
		{
			label: 'View',
			submenu: [
				{
					label: 'Reload',
					accelerator: 'CmdOrCtrl+R',
					click: function(item, focusedWindow) {
						if (focusedWindow) focusedWindow.reload()
					}
				},
				{
					label: 'Toggle Developer Tools',
					accelerator: process.platform === 'darwin' ? 'Alt+Command+I' : 'Ctrl+Shift+I',
					click: function(item, focusedWindow) {
						if (focusedWindow) focusedWindow.webContents.toggleDevTools()
					}
				},
				{
					type: 'separator'
				},
				{
					role: 'resetzoom'
				},
				{
					role: 'zoomin'
				},
				{
					role: 'zoomout'
				},
				{
					type: 'separator'
				},
				{
					role: 'togglefullscreen'
				}
			]
		},
		{
			role: 'window',
			submenu: [
				{
					role: 'minimize'
				},
				{
					role: 'close'
				}
			]
		},
		{
			role: 'help',
			submenu: [
				{
					label: 'Learn More',
					click: function() { require('electron').shell.openExternal('http://electron.atom.io') }
				}
			]
		}
	]

	if (process.platform === 'darwin') {
		var name = app.getName()
		template.unshift({
			label: name,
			submenu: [
				{
					role: 'about'
				},
				{
					type: 'separator'
				},
				{
					role: 'services',
					submenu: []
				},
				{
					type: 'separator'
				},
				{
					role: 'hide'
				},
				{
					role: 'hideothers'
				},
				{
					role: 'unhide'
				},
				{
					type: 'separator'
				},
				{
					role: 'quit'
				}
			]
		})
		// Edit menu.
		template[1].submenu.push(
			{
				type: 'separator'
			},
			{
				label: 'Speech',
				submenu: [
					{
						role: 'startspeaking'
					},
					{
						role: 'stopspeaking'
					}
				]
			}
		)
		// Window menu.
		template[3].submenu = [
			{
				label: 'Close',
				accelerator: 'CmdOrCtrl+W',
				role: 'close'
			},
			{
				label: 'Minimize',
				accelerator: 'CmdOrCtrl+M',
				role: 'minimize'
			},
			{
				label: 'Zoom',
				role: 'zoom'
			},
			{
				type: 'separator'
			},
			{
				label: 'Bring All to Front',
				role: 'front'
			}
		]
	}

	Menu.setApplicationMenu(Menu.buildFromTemplate(template));
})

app.on('window-all-closed', function() {
	app.quit()
})


// ------------------------------------------------------------
//   Sockets
// ------------------------------------------------------------

mainApp.io.on('connection', function(socket) {
	mainWindow.webContents.send('user-connection', {
		id: socket.id,
		count: mainApp.io.engine.clientsCount
	})
	
	socket.on('disconnect', function() {
		setTimeout(function() {
			mainWindow.webContents.send('user-connection', {
				id: socket.id,
				count: mainApp.io.engine.clientsCount
			})
		}, 100)
	})
})


// ------------------------------------------------------------
//   Meta route
// ------------------------------------------------------------
mainApp.express.get('/api/meta', function(req, res) {
	res.send({
		mainFolder: mainApp.mainFolder(),
		// username: low(app.getPath('appData') + '/codecast/db.json').getState().username
		username: config.get('username')
	})
})


// ------------------------------------------------------------
//   IPC Events
// ------------------------------------------------------------

ipcMain.on('turn-on', function(event) {
	mainApp.on()
	
	event.sender.send('turned-on')
})

ipcMain.on('turn-off', function(event) {
	mainApp.off()
	
	event.sender.send('turned-off')
})

ipcMain.on('get-status', function(event) {
	var status = mainApp.listening()
	
	event.sender.send('listening-status', status)
})

ipcMain.on('get-package', function(event) {
	event.sender.send('got-package', package)
})

ipcMain.on('request-io-update', function(event) {
	event.sender.send('user-connection', {
		count: mainApp.io.engine.clientsCount
	})
})

ipcMain.on('clear-folder', function(event, path) {
	mainApp.clearFolder()
})

ipcMain.on('open-file-dialog', function(event) {
	var window = BrowserWindow.fromWebContents(event.sender)
	var files = dialog.showOpenDialog(window, { properties: [ 'openDirectory' ]})
	
	if(files) {
		setFolder(event, files[0] + '/')
	}
})

ipcMain.on('drop-folder', function(event, path) {
	setFolder(event, path)
})

function setFolder(event, path) {
	
	path = path.replace(/\/$/, '') + '/'
	
	var splitted = path.split('/')
	
	var folder = {
		name: splitted[splitted.length-2],
		path: path,
		pathReadable: path.replace(app.getPath('home'), '~'),
		pre: splitted.slice(0, splitted.length-2).join('/') + '/',
		preReadable: (splitted.slice(0, splitted.length-2).join('/') + '/').replace(app.getPath('home'), '~')
	}
	
	if(mainApp.setFolder(folder)) {
		
		event.sender.send('selected-directory', folder)
		
		var history = config.get('history')
		
		history = _.reject(history, (f) => f.path == path)
		
		history.unshift(folder)
		
		config.set('history', history)
	}
}