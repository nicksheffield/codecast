angular.module('app.controllers')

.controller('HomeCtrl', function($scope, $db, $remote, $location) {
	
	if($db.state.username) {
		// $scope.username = $db.state.username
		$location.path('/scan')
	} else {
		// guess username
		var homeDir = $remote.app.getPath('home').split('/')
		$scope.username = homeDir[homeDir.length-1]
	}
	
	
	$scope.set = function() {
		if(!$scope.username) return
		
		$db.state.username = $scope.username
		$db.save()
		
		$location.path('/scan')
	}
	
})