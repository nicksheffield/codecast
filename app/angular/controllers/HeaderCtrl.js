angular.module('app.controllers')

.controller('HeaderCtrl', function($scope, $db, $location, $store, $ipc, $package) {
	$scope.username = $db.state.username
	
	$scope.current = $location.path()
	
	$scope.package = $package.json
	
	$scope.store = $store
	
	$ipc.send('get-status')
	
	$ipc.on('listening-status', function(event, listening) {
		$store.casting = listening
		$scope.$apply()
	})
})