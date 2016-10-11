angular.module('app.services')

.factory('$store', function($db) {
	var mainFolder = $db.state.currentFolder
	
	return {
		broadcasters: [],
		casting: false,
		mainFolder: mainFolder
	}
})