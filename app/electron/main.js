const fs = require('fs')
const path = require('path')

const _ = require('lodash')
const chokidar = require('chokidar')
const minimatch = require('minimatch')
const electron = require('electron')
const express = require('express')

var main = {message: 'Hello!'}

var service = {
	main: main
}

module.exports = service

const {ignore, io} = require('./central')

main.setFolder = function(path, event) {
	if(!path) return false

	var stat = fs.lstatSync(path)
	
	if(!stat.isDirectory()) return false
		
	var splitted = path.replace(/\/$/, '') + '/'
	
	splitted = splitted.split('/')
	
	var folder = {
		name: splitted[splitted.length-2],
		path: path,
		pathReadable: path.replace(electron.app.getPath('home'), '~'),
		pre: splitted.slice(0, splitted.length-2).join('/') + '/',
		preReadable: (splitted.slice(0, splitted.length-2).join('/') + '/').replace(electron.app.getPath('home'), '~')
	}
	
	main.currentFolder = folder
	
	if(event) event.sender.send('selected-directory', folder)
	
	console.log('main.currentFolder:', main.currentFolder.pathReadable)
	
	io.emit('fsupdate')
	
	var {app} = require('./http')
	
	if(app._router) {
		app._router.stack = _.filter(app._router.stack, function(middleware) {
			return middleware.name !== 'serveStatic'
		})
	}
	
	app.use(express.static(main.currentFolder.path))

	// ------------------------------------------------------------
	//   FS Events
	// ------------------------------------------------------------
	var watcher = chokidar.watch(main.currentFolder.path, {
		ignored: ignore.all.map((str) => main.currentFolder.path+str),
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

main.clearFolder = function() {
	
}

main.findFiles = function(folder) {
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
			thing.shortpath = thing.path.replace(main.currentFolder.path, '')
		
			if(ignore.match(thing)) {
				return false
			}
			
			if(thing.type == 'directory') {
				thing.files = main.findFiles(thing)
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

main.on = function() {
	
}

main.off = function() {
	
}

main.listening = function() {
	
}