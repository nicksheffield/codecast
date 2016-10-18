var fs = require('fs')
var express = require('express')
var app = express()
var http = require('http').Server(app)
var bodyParser = require('body-parser')

var service = {
	http: http,
	app: app
}

module.exports = service

var {main} = require('./main')
var {config} = require('./config')

app.use(express.static(__dirname + '/public/'))
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))

app.get('/api/flash', function(req, res) {
	res.send({username: config.get('username')})
})

app.get('/api/meta', function(req, res) {
	res.send({
		currentFolder: main.currentFolder,
		username: config.get('username'),
		broadcasting: true
	})
})

app.get('/api/files', function(req, res) {
	
	var main = require('./main')
	
	if(main.currentFolder) {
		var files = main.findFiles(main.currentFolder)
		
		files = [
			{
				type: 'directory',
				path: main.currentFolder.path,
				name: main.currentFolder.name + '/',
				shortpath: '/',
				files: files
			}
		]
		
		res.send(files)
	} else {
		res.send([])
	}
})

app.post('/api/get_file', function(req, res) {
	res.send(fs.readFileSync(req.body.path, 'utf-8'))
})

http.listen(3000)
