const fs = require('fs')
const express = require('express')
const _ = require('lodash')
const package = JSON.parse(fs.readFileSync('./package.json', 'utf8'))

const router = express.Router()

router.get('/flash', function(req, res) {
	res.send({
		codecast: true,
		version: package.version,
		username: config.get('username')
	})
})

router.get('/meta', function(req, res) {
	const {folder, config, memory} = require('./central')
	
	res.send({
		currentFolder: folder.currentFolder,
		username: config.get('username'),
		broadcasting: memory.broadcasting
	})
})

router.get('/files', function(req, res) {
	
	const {folder} = require('./central')
	
	if(folder.currentFolder) {
		const files = folder.findFiles(folder.currentFolder)
		
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