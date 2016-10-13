angular.module('app.controllers')

.controller('BroadcastCtrl', function($scope, $config, $menu, $store, $ipc, $socket, $timeout, $remote) {
	$socket.disconnect()
	$scope.casting = $store.casting
	$menu.openInBrowser(false)
	
	$scope.$watch('casting', function(newVal) {
		$store.casting = newVal
	})
	
	$scope.mainFolder = $store.mainFolder()
	$scope.folders = $config.get('history')
	
	$ipc.send('request-io-update')
	$ipc.send('get-status')
	
	$ipc.on('user-connection', function(event, data) {
		$scope.userCount = data.count
		$scope.$apply()
	})
	
	$ipc.on('turned-on', function() {
		$scope.casting = true
		$scope.$apply()
	})
	
	$ipc.on('turned-off', function() {
		$scope.casting = false
		$scope.$apply()
	})
	
	$ipc.on('listening-status', function(event, listening) {
		$scope.casting = listening
		$scope.$apply()
	})
	
	$scope.toggleCasting = function() {
		if($scope.casting) {
			$ipc.send('turn-off')
		} else {
			$ipc.send('turn-on')
		}
	}

	$scope.openDialog = function() {
		$ipc.send('open-file-dialog')
	}
	
	$scope.setFolder = function(folder) {
		$scope.mainFolder = folder
		$ipc.send('drop-folder', $scope.mainFolder.path)
	}
	
	$scope.clear = function() {
		$config.set('currentFolder', '')
		
		$scope.mainFolder = ''
		$ipc.send('clear-folder')
	}

	$scope.clearHistory = function() {
		$config.set('history', [])
		
		$scope.folders = []
	}
	
	$scope.squiggle = function(str) {
		return str.replace($remote.app.getPath('home'), '~')
	}

	$ipc.on('selected-directory', function (event, folder) {
		if(folder) {
			$scope.mainFolder = folder
			$scope.$apply()
		}
		
		$timeout(function() {
			$scope.folders = $config.get('history')
		}, 0)
		
	})

	document.ondragover = document.ondrop = function(event) {
		event.preventDefault()
	}

	document.body.ondrop = function(event) {
		console.log(event.dataTransfer.files[0].path + '/')
		event.preventDefault()
		$ipc.send('drop-folder', event.dataTransfer.files[0].path + '/')
	}
})