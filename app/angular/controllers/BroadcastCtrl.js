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
	
	$ipc.emit('request-io-update')
	$ipc.emit('get-status')
	
	$ipc.on('user-connection', function(event, data) {
		$scope.userCount = data.count
	})
	
	$ipc.on('turned-on', function() {
		$scope.casting = true
	})
	
	$ipc.on('turned-off', function() {
		$scope.casting = false
	})
	
	$ipc.on('listening-status', function(event, listening) {
		$scope.casting = listening
	})
	
	$scope.toggleCasting = function() {
		if($scope.casting) {
			$ipc.emit('turn-off')
		} else {
			$ipc.emit('turn-on')
		}
	}

	$scope.openDialog = function() {
		$ipc.emit('open-file-dialog')
	}
	
	$scope.setFolder = function(folder) {
		// $scope.mainFolder = folder
		if(require('fs').existsSync(folder.path)) {
			$ipc.emit('drop-folder', folder.path)
		} else {
			$ipc.emit('open-error-dialog', {
				title: 'Folder not found',
				message: 'That folder has either been deleted or moved.'
			})
		}
	}
	
	$scope.clear = function() {
		$config.set('currentFolder', '')
		
		$scope.mainFolder = ''
		$ipc.emit('clear-folder')
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
		$ipc.emit('drop-folder', event.dataTransfer.files[0].path + '/')
	}
})