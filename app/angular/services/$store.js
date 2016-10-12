angular.module('app.services')

.factory('$store', function($config, $ipc, $timeout) {
	return {
		broadcasters: [],
		casting: false,
		mainFolder: function() {
			return $config.get('currentFolder')
		}
	}
})