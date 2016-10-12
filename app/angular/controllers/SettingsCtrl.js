angular.module('app.controllers')

.controller('SettingsCtrl', function($scope, $db, $location, $menu, $ipc, $socket) {
	$socket.disconnect()
	$scope.db = $db.state
	$menu.openInBrowser(false)
	
	$scope.saved = false
	
	$scope.$watch('db', function() {
		$scope.saved = false
	})
	
	$scope.save = function() {
		$db.save()
		
		$scope.saved = true
	}
	
	$ipc.send('get-package')
	
	$ipc.on('got-package', function(event, data) {
		$scope.package = data
	})
})