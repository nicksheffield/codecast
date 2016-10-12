angular.module('app.controllers')

.controller('SettingsCtrl', function($scope, $config, $location, $menu, $ipc, $socket, $package) {
	$socket.disconnect()
	$menu.openInBrowser(false)
	
	$scope.username = $config.get('username')
	
	$scope.saved = false
	$scope.package = $package.json
	
	$scope.save = function() {
		$config.set('username', $scope.username)
		
		$scope.saved = true
	}
})