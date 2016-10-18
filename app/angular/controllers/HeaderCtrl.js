angular.module('app.controllers')

.controller('HeaderCtrl', function($scope, $rootScope, $location, $store, $ipc, $colorschemes, $colorthemes) {
	$scope.current = $location.path()
	
	$scope.version = process.env.npm_package_version
	
	$rootScope.WindowTitle = 'CodeCast ' + $scope.version
	
	$scope.store = $store
	
	$ipc.send('get-status')
	
	$ipc.on('listening-status', function(event, listening) {
		$store.casting = listening
		$scope.$apply()
	})
})