angular.module('app.controllers')

.controller('SettingsCtrl', function($scope, $rootScope, $config, $location, $menu, $ipc, $socket, $colorschemes, $colorthemes) {
	$socket.disconnect()
	$menu.openInBrowser(false)
	
	$scope.username = $config.get('username')
	
	$scope.saved = false
	
	$scope.save = function() {
		$config.set('username', $scope.username)
		$config.set('colorscheme', $scope.colorscheme)
		$config.set('colortheme', $scope.colortheme)
		$config.set('lightmode', $scope.lightmode.name == 'Light')
		
		$rootScope.colorscheme = $scope.colorscheme.style
		$rootScope.colortheme = $scope.colortheme.style
		
		$colorschemes.current = $scope.colorscheme
		$colorthemes.current = $scope.colortheme
		
		$scope.saved = true
	}
	
	$scope.colorscheme = $colorschemes.current
	$scope.colorschemes = $colorschemes.schemes
	
	$scope.colortheme = $colorthemes.current
	$scope.colorthemes = $colorthemes.themes
	
	$scope.lightmodes = [{name: 'Dark'}, {name: 'Light'}]
	
	if($config.get('lightmode')) {
		$scope.lightmode = $scope.lightmodes[1]
	} else {
		$scope.lightmode = $scope.lightmodes[0]
	}

})