angular.module('app.controllers')

.controller('SettingsCtrl', function($scope, $db, $location, $menu, $ipc, $socket, $package) {
	$socket.disconnect()
	$scope.db = $db.state
	$menu.openInBrowser(false)
	
	$scope.saved = false
	$scope.package = $package.json
	
	$scope.$watch('db', function() {
		$scope.saved = false
	})
	
	$scope.save = function() {
		$db.save()
		
		$scope.saved = true
	}
	
	
})