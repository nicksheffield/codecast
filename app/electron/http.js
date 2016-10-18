var fs = require('fs')
var express = require('express')
var _ = require('lodash')

var router = express.Router()

router.get('/flash', function(req, res) {
	res.send({
		codecast: true,
		version: process.env.npm_package_version,
		username: config.get('username')
	})
})

router.get('/meta', function(req, res) {
	var {folder, config, memory} = require('./central')
	
	res.send({
		currentFolder: folder.currentFolder,
		username: config.get('username'),
		broadcasting: memory.broadcasting
	})
})

router.get('/files', function(req, res) {
	
	var {folder} = require('./central')
	
	if(folder.currentFolder) {
		var files = folder.findFiles(folder.currentFolder)
		
		files = [
			{
				type: 'directory',
				path: folder.currentFolder.path,
				name: folder.currentFolder.name + '/',
				shortpath: '/',
				files: files
			}
		]
		
		res.send(files)
	} else {
		res.send([])
	}
})

router.post('/get_file', function(req, res) {
	res.send(fs.readFileSync(req.body.path, 'utf-8'))
})

module.exports = router