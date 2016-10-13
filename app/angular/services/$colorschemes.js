angular.module('app.services')

.factory('$colorschemes', function($rootScope, $config, $timeout) {
	var service = {
		current: {},
		schemes: [
			{ name: 'Default', style: 'color-default' },
			{ name: 'Orange', style: 'color-orange' },
			{ name: 'Purple', style: 'color-purple' },
			{ name: 'Green', style: 'color-green' },
			{ name: 'Pink', style: 'color-pink' },
			{ name: 'Red', style: 'color-red' },
		]
	}
	
	var original = $config.get('colorscheme')
	
	if(original) {
		$rootScope.colorscheme = original.style || 'color-default'
		service.current = _.find(service.schemes, function(scheme) {
			return scheme.style == original.style
		})
		$timeout(function() {
			$rootScope.$digest()
		}, 0)
	}
	
	return service
})