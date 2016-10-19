const _ = require('lodash')
const evilscan = require('evilscan')

const {server} = require('./central')

const port = 3000
const range = 0

const matches = []

const options = {
	target: '127.0.0.1',
	port: port + '-' + (port + range),
	status: 'TROU', // Timeout, Refused, Open, Unreachable
	banner: true
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
	
	console.log('Listening on port', m.port)
	server.listen(m.port)
});

scanner.run();
