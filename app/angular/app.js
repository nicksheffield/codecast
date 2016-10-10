angular.module('app.controllers', [])
angular.module('app.directives', [])
angular.module('app.services', [])
angular.module('app.filters', [])
angular.module('app.routes', [])
angular.module('app.views', [])

angular.module('app', [
	'ngRoute',	
	
	'app.controllers',
	'app.directives',
	'app.services',
	'app.filters',
	'app.routes',
	'app.views'
])