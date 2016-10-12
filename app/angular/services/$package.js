angular.module('app.services')

.factory('$package', function($ipc) {
	$ipc.send('get-package')
	
	$ipc.on('got-package', function(event, data) {
		service.json = data
	})
	
	var service = {
		json: {}
	}
	
	return service
})