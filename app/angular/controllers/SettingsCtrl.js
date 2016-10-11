angular.module('app.controllers')

.controller('SettingsCtrl', function($scope, $db, $location, $menu) {
	$scope.db = $db.state
	$menu.openInBrowser(false)
	
	$scope.save = function() {
		$db.save()
	}
})