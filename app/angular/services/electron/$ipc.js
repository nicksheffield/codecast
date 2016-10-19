angular.module('app.services')

// https://github.com/electron/electron/blob/master/docs/api/ipc-renderer.md
.factory('$ipc', function($rootScope) {
	var ipcRenderer = require('electron').ipcRenderer
	
	return {
		on: function(eventName, callback) {
			ipcRenderer.on(eventName, function() {
				var args = arguments;
				$rootScope.$apply(function() {
					callback.apply(ipcRenderer, args);
				});
			});
		},
		emit: function(eventName, data, callback) {
			ipcRenderer.send(eventName, data, function() {
				var args = arguments;
				$rootScope.$apply(function() {
					if (callback) {
						callback.apply(ipcRenderer, args);
					}
				});
			});
		}
	}
})