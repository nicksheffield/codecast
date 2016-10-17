angular.module('app.services')

.factory('$config', function() {
	return require('./electron/config')
})