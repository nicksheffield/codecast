angular.module('app.services')

.factory('$remote', function() {
	return require('electron').remote
})