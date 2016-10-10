angular.module('app.controllers')

.controller('HeaderCtrl', function($scope, $db, $location) {
	$scope.username = $db.state.username
	
	$scope.current = $location.path()
})