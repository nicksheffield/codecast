angular.module('app.services')

// https://github.com/electron/electron/blob/master/docs/api/shell.md
.factory('$shell', function() {
	return require('electron').shell
})