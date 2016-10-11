angular.module('app.routes')

.config(function($routeProvider) {

	$routeProvider
		.when('/scan', {
			templateUrl: 'angular/views/scan.html',
			controller: 'ScanCtrl'
		})
		.when('/view/:ip', {
			templateUrl: 'angular/views/view.html',
			controller: 'ViewCtrl'
		})
		.when('/broadcast', {
			templateUrl: 'angular/views/broadcast.html',
			controller: 'BroadcastCtrl'
		})
		.when('/settings', {
			templateUrl: 'angular/views/settings.html',
			controller: 'SettingsCtrl'
		})
		
		.otherwise({
			redirectTo: '/scan'
		})
	
})