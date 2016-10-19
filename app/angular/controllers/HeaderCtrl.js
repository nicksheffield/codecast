angular.module('app.controllers')

.controller('HeaderCtrl', function($scope, $rootScope, $location, $store, $ipc, $colorschemes, $colorthemes) {
	$scope.current = $location.path()
	
	$rootScope.WindowTitle = 'CodeCast ' + $scope.version
	
	$scope.store = $store
	
	$ipc.emit('get-status')
	
	$ipc.on('listening-status', function(event, listening) {
		$store.casting = listening
	})
	
	$ipc.emit('get-version')
	
	$ipc.on('version', function(event, version) {
		$scope.version = version
		$rootScope.WindowTitle = 'CodeCast ' + $scope.version
	})
})