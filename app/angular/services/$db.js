angular.module('app.services')

.factory('$db', function($remote) {
	var db = require('lowdb')($remote.app.getPath('appData') + '/codecast/db.json')
	
	var state = db.getState()
	
	return {
		state: state,
		save: db.write
	}
})