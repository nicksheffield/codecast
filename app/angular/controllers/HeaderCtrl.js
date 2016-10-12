angular.module('app.controllers')

.controller('HeaderCtrl', function($scope, $location, $store, $ipc, $package) {
	$scope.current = $location.path()
	
	$scope.package = $package
	
	$scope.store = $store
	
	$ipc.send('get-status')
	
	$ipc.on('listening-status', function(event, listening) {
		$store.casting = listening
		$scope.$apply()
	})
})