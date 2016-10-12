angular.module('app.services')

.factory('$store', function($db, $ipc, $timeout) {
	var mainFolder = $db.state.currentFolder
	
	$ipc.send('drop-folder', mainFolder[0])
	
	return {
		broadcasters: [],
		casting: false,
		mainFolder: mainFolder
	}
})