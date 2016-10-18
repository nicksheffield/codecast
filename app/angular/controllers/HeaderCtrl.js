angular.module('app.controllers')

.controller('HeaderCtrl', function($scope, $location, $store, $ipc, $colorschemes, $colorthemes) {
	$scope.current = $location.path()
	
	$scope.version = process.env.npm_package_version
	
	$scope.store = $store
	
	$ipc.send('get-status')
	
	$ipc.on('listening-status', function(event, listening) {
		$store.casting = listening
		$scope.$apply()
	})
})