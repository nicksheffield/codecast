angular.module('app.services')

// https://github.com/electron/electron/blob/master/docs/api/remote.md
.factory('$remote', function() {
	return require('electron').remote
})