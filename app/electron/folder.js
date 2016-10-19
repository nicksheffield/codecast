const fs = require('fs')
const path = require('path')

const _ = require('lodash')
const chokidar = require('chokidar')
const minimatch = require('minimatch')
const {app} = require('electron')
const express = require('express')

var service = {message: 'Hello!'}

module.exports = {
	folder: service
}

const {io, config, ignore} = require('./central')

service.setFolder = function(fPath, event) {
	if(!fPath) return false
	if(!fs.lstatSync(fPath).isDirectory()) return false

	const home = app.getPath('home')
	
	const folder = {
		name: path.basename(fPath),
		path: fPath,
		pathReadable: fPath.replace(home, '~'),
		pre: path.dirname(fPath) + '/',
		preReadable: path.dirname(fPath).replace(app.getPath('home'), '~') + '/'
	}
	
	service.currentFolder = folder
	ignore.setup(folder)
	config.set('currentFolder', folder)
	
	let history = config.get('history') || []
	history = history.filter((f) => f.path !== fPath)
	history.unshift()
	config.set('history', history)
	
	if(event) event.sender.send('selected-directory', folder)
	
	console.log('currentFolder:', service.currentFolder.pathReadable)
	
	io.emit('fsupdate')
	
	const {expressApp} = require('./central')
	
	if(expressApp._router) {
		expressApp._router.stack = _.filter(expressApp._router.stack, function(middleware) {
			return middleware.name !== 'serveStatic'
		})
	}
	
	expressApp.use(express.static(service.currentFolder.path))

	// ------------------------------------------------------------
	//   FS Events
	// ------------------------------------------------------------
	var watcher = chokidar.watch(service.currentFolder.path, {
		ignored: ignore.all.map((str) => service.currentFolder.path+str),
		ignoreInitial: true
	})

	watcher.on('all', (event, path) => {
		var simplePath = path
		var filename = simplePath.split('/')[simplePath.split('/').length-1]
		
		if(event == 'change') {
			io.emit('fschange', {path: simplePath})
			return
		}
		
		io.emit('fsupdate')
	});
	
	return true
}

service.clearFolder = function() {
	service.currentFolder = {
		path: '',
		readable: '',
		pre: '',
		name: ''
	}
	
	io.emit('fsupdate')
}

service.findFiles = function(folder) {
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
			thing.shortpath = thing.path.replace(service.currentFolder.path, '')
		
			if(ignore.match(thing)) {
				return false
			}
			
			if(thing.type == 'directory') {
				thing.files = service.findFiles(thing)
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
