angular.module('app.routes')

.config(function($routeProvider) {
	
	$routeProvider
		.when('/', {
			templateUrl: 'angular/views/home.html',
			controller: 'HomeCtrl'
		})
		
		.otherwise({
			redirectTo: '/'
		})
	
})