angular.module('app.services')

.factory('$config', function() {
	var Config = require('electron-config')
	var config = new Config()
	
	var service = {
		get: function(name) {
			var config = new Config()
			return config.get(name)
		},
		set: function(name, val) {
			return config.set(name, val)
		}
	}
	
	return service
})