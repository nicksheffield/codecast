angular.module('app.services')

.factory('$colorthemes', function($rootScope, $config, $timeout) {
	var service = {
		current: null,
		themes: [
			{ name: 'Atom Dark', style: 'assets/prism-themes/themes/prism-atom-dark.css' },
			{ name: 'Okaidia', style: 'components/prism/themes/prism-okaidia.css' },
			{ name: 'Dark', style: 'components/prism/themes/prism-dark.css' },
			{ name: 'Funky', style: 'components/prism/themes/prism-funky.css' },
			{ name: 'Solarized Light', style: 'components/prism/themes/prism-solarizedlight.css' },
			{ name: 'Tomorrow', style: 'components/prism/themes/prism-tomorrow.css' },
			{ name: 'Twilight', style: 'components/prism/themes/prism-twilight.css' },
			{ name: 'Github Colors', style: 'assets/prism-themes/themes/prism-ghcolors.css' },
			{ name: 'Duotone Dark', style: 'assets/prism-themes/themes/prism-duotone-dark.css' },
			{ name: 'Duotone Earth', style: 'assets/prism-themes/themes/prism-duotone-earth.css' },
			{ name: 'Duotone Forest', style: 'assets/prism-themes/themes/prism-duotone-forest.css' },
			{ name: 'Duotone Light', style: 'assets/prism-themes/themes/prism-duotone-light.css' },
			{ name: 'Duotone Sea', style: 'assets/prism-themes/themes/prism-duotone-sea.css' },
			{ name: 'Duotone Space', style: 'assets/prism-themes/themes/prism-duotone-space.css' },
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