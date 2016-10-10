angular.module('app.controllers')

.controller('ScanCtrl', function($scope, $db, $location, $store) {
	
	$scope.username = $db.state.username
	
	$scope.forget = function() {
		$db.state.username = ''
		$db.save()
		
		$location.path('/')
	}
	
	$scope.scanning = false
	
	$scope.broadcasters = $store.broadcasters
	
	$scope.scan = function() {
		var evilscan = require('evilscan')
		var ip = require('ip')
		 
		var address = ip.address().split('.')
		 
		address.pop()
		 
		var options = {
			target: address.join('.') + '.0/24',
			port: '3000',
			status: 'TROU', // Timeout, Refused, Open, Unreachable
			banner: true
		}
		 
		var scanner = new evilscan(options)
		 
		scanner.on('result',function(data) {
			if(data.status == 'open') {
				console.log('Open:', data)
				
				var found = _.find($scope.broadcasters, function(item) {
					return data.ip == item.ip
				})
				
				if(found === undefined) {
					$scope.broadcasters.push(data)
				}
			} else {
				var found = _.find($scope.broadcasters, function(item) {
					return data.ip == item.ip
				})
				
				if(found) {
					$scope.broadcasters = _.reject($scope.broadcasters, function(item) {
						return item.ip == data.ip
					})
				}
			}
		})
		 
		scanner.on('error',function(err) {
			throw new Error(data.toString())
		})
		 
		scanner.on('done',function() {
			// finished !
			$scope.scanning = false
			$scope.$apply()
		})
		 
		scanner.run()
		
		$scope.scanning = true
	}
	
	$scope.scan()
	
})