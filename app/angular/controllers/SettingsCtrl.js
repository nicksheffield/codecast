angular.module('app.controllers')

.controller('SettingsCtrl', function($scope, $db, $location) {
	$scope.db = $db.state
	
	$scope.save = function() {
		$db.save()
	}
})