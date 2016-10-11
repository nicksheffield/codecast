angular.module('app.controllers')

.controller('HeaderCtrl', function($scope, $db, $location, $store) {
	$scope.username = $db.state.username
	
	$scope.current = $location.path()
	
	$scope.store = $store
})