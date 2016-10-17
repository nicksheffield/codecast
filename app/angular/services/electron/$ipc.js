angular.module('app.services')

// https://github.com/electron/electron/blob/master/docs/api/ipc-renderer.md
.factory('$ipc', function() {
	return require('electron').ipcRenderer
})