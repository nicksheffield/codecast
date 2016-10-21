const _ = require('lodash')
const evilscan = require('evilscan')

const {server} = require('./central')
const {dialog} = require('electron')

const {port, range} = require('./ports.js')

const matches = []

const options = {
	target: '127.0.0.1',
	port: range,
	status: 'TROU', // Timeout, Refused, Open, Unreachable
	banner: false,
	concurrency: 1000
}

const scanner = new evilscan(options)

scanner.on('result',function(data) {
	matches.push(data)
});

scanner.on('error',function(err) {
	throw new Error(err.toString());
});

scanner.on('done',function() {
	
	const m = _.find(matches, function(match) {
		return match.status == 'closed (refused)'
	})
	
	if(!m) {
		dialog.showErrorBox('No free ports', 'All available ports are already in use. You won\'t be able to broadcast.')
	} else {
		console.log('Listening at', require('ip').address(), ':', m.port)
		server.listen(m.port)
	}
});

scanner.run();