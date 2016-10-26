var {app} = require('electron')
var Config = require('electron-config')
var conf = new Config()

console.log('config path:', conf.path)

var store = conf.store

var config = {
	get: function(name) {
		return store[name]
	},
	set: function(name, val) {
		let config = new Config()
		config.set(name, val)
		store = config.store
		
		return val
	},
	refresh: function() {
		let config = new Config()
		store = config.store
	}
}

if(!store.username) {
	config.set('username', app.getPath('home').replace('/Users/', ''))
}

module.exports = { config }