angular.module('app.services')

.factory('$config', function($ipc) {
	var Config = require('electron-config')
	var conf = new Config()
	
	var store = conf.store
	
	var service = {
		get: function(name) {
			return store[name]
		},
		set: function(name, val) {
			let config = new Config()
			config.set(name, val)
			store = config.store
			
			$ipc.emit('config-change')
			
			return val
		}
	}
	
	return service
})