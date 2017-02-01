angular.module('app.services')

.factory('$store', function($config, $ipc, $timeout) {
	return {
		openFiles: [],
		currentFile: {},
		broadcasters: [],
		casting: false,
		mainFolder: function() {
			return $config.get('currentFolder')
		}
	}
})