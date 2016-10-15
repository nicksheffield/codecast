// ------------------------------------------------------------
//   Dependencies
// ------------------------------------------------------------
// var pwd         = process.env.PWD + '/'

var _           = require('lodash')
var fs          = require('fs')
var express     = require('express')
var exapp       = express()
var http        = require('http').Server(exapp)
var io          = require('socket.io')(http)
var chokidar    = require('chokidar')
var bodyParser  = require('body-parser')
var path        = require('path')
var minimatch   = require('minimatch')
var Config      = require('electron-config')
var config      = new Config()

var fileApp = express()
var fileServer = require('http').Server(fileApp)



// ------------------------------------------------------------
//   Default ignored folders and files
// ------------------------------------------------------------
// These ignores are for every folder
var defaultIgnore = [
	'node_modules',
	'bower_components',
	'vendor',
	'storage',
	'.git',
	'sftp_config.json',
	'project.sublime-workspace',
	'thumbs.db',
	'.DS_Store',
	'*.app',
	'*.asar',
	'*.zip',
	'*.exe',
	'*.icns'
]

// These ignores are set up per folder
var otherIgnore = []

function allIgnores() {
	return defaultIgnore.concat(otherIgnore)
}


// ------------------------------------------------------------
//   Set Folder
// ------------------------------------------------------------
var mainFolder = ''

function setFolder(folder) {
	if(!folder) return false

	var stat = fs.lstatSync(folder.path)
	
	if(!stat.isDirectory()) return false
	
	mainFolder = folder
	config.set('currentFolder', mainFolder)
	
	console.log('mainFolder chosen:', mainFolder.pathReadable)
	
	io.emit('fsupdate')
	
	otherIgnore = []
	
	// ------------------------------------------------------------
	//   Bower ignore
	// ------------------------------------------------------------
	if(fs.existsSync(mainFolder.path + '.bowerrc')) {
		var bowerrc = JSON.parse(fs.readFileSync(mainFolder.path + '.bowerrc', "utf8"))
		
		if(bowerrc.directory) otherIgnore.push(bowerrc.directory)
	}
	
	// ------------------------------------------------------------
	//   Set Express Static Middleware
	// ------------------------------------------------------------
	
	if(fileApp._router) {
		fileApp._router.stack = _.filter(fileApp._router.stack, function(middleware) {
			return middleware.name !== 'serveStatic'
		})
	}
	
	fileApp.use(express.static(mainFolder.path))
	

	// ------------------------------------------------------------
	//   Load sublime-project files
	// ------------------------------------------------------------
	var rootFiles = fs.readdirSync(mainFolder.path)

	_.forEach(rootFiles, function(file) {
		if(sublimeProjectPattern.test(file)) {
			sublimeProject = JSON.parse(fs.readFileSync(mainFolder.path + file, "utf8"))
		}
	})


	// ------------------------------------------------------------
	//   FS Events
	// ------------------------------------------------------------
	var watcher = chokidar.watch(mainFolder.path, {ignored: allIgnores().map((str) => mainFolder.path+str), ignoreInitial: true})

	watcher.on('all', (event, path) => {
		// console.log('chokidar', event, path)
		
		var simplePath = path
		var filename = simplePath.split('/')[simplePath.split('/').length-1]
		
		if(sublimeProjectPattern.test(simplePath.replace(mainFolder.path, ''))) {
			sublimeProject = JSON.parse(fs.readFileSync(path, "utf8"))
			io.emit('fsupdate')
		}
		
		if(event == 'change') {
			io.emit('fschange', {path: simplePath})
			return
		}
		
		io.emit('fsupdate')
	});
	
	return true
}


var sublimeProjectPattern = /[a-zA-Z0-9\_\-]+.sublime-project/

var sublimeProject = {
	"folders": [
		{
			"folder_exclude_patterns": [],
			"file_exclude_patterns": []
		}
	]
}


function checkIfExcludedFolder(path) {
	for(var i=0; i<sublimeProject.folders.length; i++) {
		var projectFolder = sublimeProject.folders[i]
		
		if(_.indexOf(projectFolder.folder_exclude_patterns, path.substring(0, path.length-1)) !== -1) {
			return true
		}
	}
}

function checkIfExcludedFile(path) {
	for(var i=0; i<sublimeProject.folders.length; i++) {
		var projectFolder = sublimeProject.folders[i]
		
		if(_.indexOf(projectFolder.file_exclude_patterns, path) !== -1) {
			return true
		}
	}
}

// ------------------------------------------------------------
//   Middleware
// ------------------------------------------------------------
exapp.use(express.static(__dirname + '/public/'))
exapp.use(bodyParser.json())
exapp.use(bodyParser.urlencoded({ extended: true }))


// ------------------------------------------------------------
//   Express API
// ------------------------------------------------------------
exapp.get('/api/files', function(req, res) {
	if(mainFolder) {
		var files = findFiles({path: mainFolder.path})
		
		files = [
			{
				type: 'directory',
				path: mainFolder.path,
				name: mainFolder.name + '/',
				shortpath: '/',
				files: files
			}
		]
		
		res.send(files)
	} else {
		res.send([])
	}
})

exapp.post('/api/get_file', function(req, res) {
	res.send(fs.readFileSync(req.body.path, 'utf-8'))
})


// ------------------------------------------------------------
//   Recursive Datastructure for Dirs and Files
// ------------------------------------------------------------
function findFiles(folder) {
	var folderStat = fs.lstatSync(folder.path)
	
	if(folderStat.isDirectory() && path.extname(folder.path) !== '.asar') {
		var paths = fs.readdirSync(folder.path)
		var files = []

		paths.forEach(function(path) {
			var thing = {}
			var stat = fs.lstatSync(folder.path + path)
			var name = path + (stat.isDirectory() ? '/' : '')
			
			thing.type = stat.isFile() ? 'file' : 'directory'
			thing.path = folder.path + name
			thing.name = name
			thing.shortpath = thing.path.replace(mainFolder.path, '')
			
			// if(allIgnores().indexOf(thing.shortpath) !== -1) {
			// 	return
			// }
		
			for(var j=0; j<allIgnores().length; j++) {
				var pattern = allIgnores()[j]
				
				var match = minimatch(thing.shortpath, pattern, {matchBase: true})
				
				if(match) {
					return
				}
			}
			
			if(thing.type == 'file') {
				if(checkIfExcludedFile(thing.shortpath)) {
					return
				}
			} else if(thing.type == 'directory') {
				if(checkIfExcludedFolder(thing.shortpath)) {
					return
				}
			} else {
				console.log('dunno what this is', thing)
				return
			}
			
			if(thing.type == 'directory') {
				thing.files = findFiles(thing)
			}
			
			files.push(thing)
		})
		
		return _.sortBy(files, function(file) {
			return file.type !== 'directory'
		})
	} else {
		return []
	}
}


// ------------------------------------------------------------
//   Socket.IO
// ------------------------------------------------------------
io.on('connection', function(socket) {
	console.log('A user connected', socket.id)
	socket.emit('connected')
	socket.emit('fsupdate')
})


// ------------------------------------------------------------
//   Start the Server
// ------------------------------------------------------------

var httpListening = false
var fileServerListening = false


// ------------------------------------------------------------
//   Expose properties for module
// ------------------------------------------------------------

module.exports = {
	io: io,
	server: http,
	express: exapp,
	setFolder: setFolder,
	clearFolder: function() {
		mainFolder = {
			path: '',
			readable: '',
			pre: '',
			name: ''
		}
		
		io.emit('fsupdate')
	},
	mainFolder: function() {
		return mainFolder
	},
	on: function() {
		console.log('turned on')
		http.listen(3000, function() {
			httpListening = true
		})
		fileServer.listen(3333, function() {
			fileServerListening = true
		})
	},
	off: function() {
		console.log('turned off')
		http.close()
		fileServer.close()
		
		httpListening = false
		fileServerListening = false
	},
	listening: function() {
		return httpListening
	}
}