angular.module('app.services')

.factory('$ipc', function() {
	return require('electron').ipcRenderer
})