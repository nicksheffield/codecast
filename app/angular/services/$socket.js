angular.module('app.services')

.factory('$socket', function($rootScope) {
	// var socket = io.connect($config.socketURL)
	var on = {}

	var service = {
		connect: function(ip) {
			service.socket = io.connect('http://' + ip + ':3000')
			
			for(var eventName in on) {
				service.socket.on(eventName, on[eventName])
			}
		},
		disconnect: function() {
			if(service.socket) {
				service.socket.disconnect()
			}
		},
		on: function(eventName, callback) {
			on[eventName] = callback
		},
		emit: function(eventName, data, callback) {
			service.socket.emit(eventName, data, function() {
				var args = arguments
				$rootScope.$apply(function() {
					if (callback) {
						callback.apply(socket, args)
					}
				})
			})
		}
	}
	
	return service
})