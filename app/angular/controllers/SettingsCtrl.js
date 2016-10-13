angular.module('app.controllers')

.controller('SettingsCtrl', function($scope, $rootScope, $config, $location, $menu, $ipc, $socket, $colorschemes) {
	$socket.disconnect()
	$menu.openInBrowser(false)
	
	$scope.username = $config.get('username')
	
	$scope.saved = false
	
	$scope.save = function() {
		$config.set('username', $scope.username)
		$config.set('colorscheme', $scope.colorscheme)
		
		$rootScope.colorscheme = $scope.colorscheme.style
		
		$scope.saved = true
	}
	
	$scope.colorscheme = $colorschemes.current
	$scope.colorschemes = $colorschemes.schemes

})