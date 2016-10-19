angular.module('app.controllers')

.controller('HeaderCtrl', function($scope, $rootScope, $location, $store, $ipc, $remote, $colorschemes, $colorthemes) {
	$scope.current = $location.path()
	
	$scope.version = $remote.app.getVersion()
	
	$rootScope.WindowTitle = 'CodeCast ' + $scope.version
	
	$scope.store = $store
	
	$ipc.emit('get-status')
	
	$ipc.on('listening-status', function(event, listening) {
		$store.casting = listening
	})
})