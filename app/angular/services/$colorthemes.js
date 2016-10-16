angular.module('app.services')

.factory('$colorthemes', function($rootScope, $config, $timeout) {
	var service = {
		current: null,
		themes: [
			{ name: 'Okaidia', style: 'components/prism/themes/prism-okaidia.css' },
			{ name: 'Atom One Dark', style: 'assets/prism-atom-one-dark.css' },
		]
	}
	
	var original = $config.get('colortheme')
	
	if(original) {
		$rootScope.colortheme = original.style || 'components/prism/themes/prism-okaidia.css'
		service.current = _.find(service.themes, function(theme) {
			return theme.style == original.style
		})
		$timeout(function() {
			$rootScope.$digest()
		}, 0)
	} else {
		service.current = service.themes[0]
		$config.set('colortheme', service.current)
		$rootScope.$digest()
	}
	
	return service
})