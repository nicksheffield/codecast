angular.module('app.controllers')

.controller('SettingsCtrl', function($scope, $db, $location, $menu) {
	$scope.db = $db.state
	$menu.openInBrowser(false)
	
	$scope.saved = false
	
	$scope.$watch('db', function() {
		$scope.saved = false
	})
	
	$scope.save = function() {
		$db.save()
		
		$scope.saved = true
	}
})