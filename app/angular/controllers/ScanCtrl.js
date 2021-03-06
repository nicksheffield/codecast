angular.module('app.controllers')

.controller('ScanCtrl', function($scope, $location, $store, $http, $menu, $socket) {
	$socket.disconnect()
	$menu.openInBrowser(false)
	
	$scope.scanning = false
	
	$scope.broadcasters = $store.broadcasters
	
	$scope.notBroadcasting = function() {
		console.log('notBroadcasting', _.filter($scope.broadcasters, (u) => !u.meta.broadcasting))
		return _.filter($scope.broadcasters, (u) => !u.meta.broadcasting)
	}
	
	$scope.scan = function() {
		var evilscan = require('evilscan')
		var ip = require('ip')
		
		var address = ip.address().split('.')
		
		address.pop()
		
		var {port, range} = require('./electron/ports.js')
		
		var options = {
			target: address.join('.') + '.0/24',
			port: range,
			status: 'TROU', // Timeout, Refused, Open, Unreachable
			banner: true,
			concurrency: 4000
		}
		
		var scanner = new evilscan(options)
		
		scanner.on('result',function(data) {
			if(data.status == 'open') {
				console.log('scan result -', `${data.ip}:${port - data.port}`, data.status)
				var found = _.find($scope.broadcasters, function(item) {
					return data.ip == item.ip
				})
				
				if(found === undefined) {
					$scope.broadcasters.push(data)
				}
				
				// get meta
				$http.get('http://' + data.ip + ':' + data.port + '/api/meta')
					.then(function(res) {
						console.log('meta', res)
						var caster = _.find($scope.broadcasters, function(item) {
							return data.ip == item.ip
						})
						caster.meta = res.data
					})
			} else {
				var found2 = _.find($scope.broadcasters, function(item) {
					return data.ip == item.ip
				})
				
				if(found2) {
					$scope.broadcasters = _.reject($scope.broadcasters, function(item) {
						return item.ip == data.ip
					})
				}
			}
		})
		
		scanner.on('error',function(err) {
			throw new Error(err.toString())
		})
		
		scanner.on('done',function() {
			// finished!
			console.log('scan - finished')
			$scope.scanning = false
			$scope.$apply()

			$store.broadcasters = $scope.broadcasters
		})
		
		scanner.run()
		
		console.log('scan - started')
		$scope.scanning = true
	}
	
	$scope.scan()
	
})