angular.module('app.controllers')

.controller('HeaderCtrl', function($scope, $db) {
	$scope.username = $db.state.username
})