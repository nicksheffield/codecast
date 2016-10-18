angular.module('app.controllers')

.controller('ScanCtrl', function($scope, $location, $store, $http, $menu, $socket) {
	$socket.disconnect()
	$menu.openInBrowser(false)
	
	$scope.scanning = false
	
	$scope.broadcasters = $store.broadcasters
	
	$scope.scanProgress = 0
	$scope.scanned = 0
	
	$scope.scan = function() {
		var evilscan = require('evilscan')
		var ip = require('ip')
		
		var address = ip.address().split('.')
		
		address.pop()
		
		var options = {
			target: address.join('.') + '.0/24',
			port: '3000-3005',
			status: 'TROU', // Timeout, Refused, Open, Unreachable
			banner: true
		}
		
		var scanner = new evilscan(options)
		
		scanner.on('result',function(data) {
			$scope.scanned++
			
			var max = 255 * 5 // 5 is the difference between 3000 and 3005, up above in the options.port
			
			$scope.scanProgress = 100 / max * $scope.scanned
			$scope.$apply()

			if(data.status == 'open') {
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
			$scope.scanning = false
			$scope.scanProgress = 0
			$scope.$apply()
		})
		
		$scope.scanned = 0
		scanner.run()
		
		$scope.scanning = true
	}
	
	$scope.scan()
	
})