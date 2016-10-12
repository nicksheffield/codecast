angular.module('app.controllers')

.controller('BroadcastCtrl', function($scope, $db, $menu, $store, $ipc) {
	$scope.casting = $store.casting
	$menu.openInBrowser(false)
	
	$scope.$watch('casting', function(newVal) {
		$store.casting = newVal
	})
	
	$scope.$watch('mainFolder', function(newVal, oldVal) {
		$store.mainFolder = newVal
		$db.state.currentFolder = newVal
		$db.save()
	})
	
	$scope.mainFolder = $store.mainFolder
	
	$ipc.send('request-io-update')
	$ipc.send('get-folders')
	$ipc.send('get-status')
	
	$ipc.on('user-connection', function(event, data) {
		$scope.userCount = data.count
		$scope.$apply()
	})
	
	$ipc.on('list-folders', function(event, folders) {
		$scope.folders = folders.reverse()
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
		$ipc.send('drop-folder', $scope.mainFolder)
	}

	$ipc.on('selected-directory', function (event, path) {
		if(path) {
			$scope.mainFolder = path
			$scope.$apply()
		}
		
		$ipc.send('get-folders')
	})

	document.ondragover = document.ondrop = function(event) {
		event.preventDefault()
	}

	document.body.ondrop = function(event) {
		console.log(event.dataTransfer.files[0].path)
		event.preventDefault()
		$ipc.send('drop-folder', event.dataTransfer.files[0].path)
	}
})