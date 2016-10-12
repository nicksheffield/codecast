angular.module('app.services')

.factory('$package', function($ipc, $rootScope) {
	$ipc.send('get-package')
	
	$ipc.on('got-package', function(event, data) {
		console.log('received package', data)
		service.json = data
		$rootScope.$digest()
	})
	
	var service = {
		json: {}
	}
	
	return service
})