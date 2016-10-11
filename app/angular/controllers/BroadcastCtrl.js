angular.module('app.controllers')

.controller('BroadcastCtrl', function($scope, $db, $menu, $store) {
	$scope.casting = $store.casting
	$menu.openInBrowser(false)
	
	$scope.mainFolder = $store.mainFolder
	
	$scope.$watch('casting', function(newVal) {
		$store.casting = newVal
	})
	
	$scope.$watch('mainFolder', function(newVal) {
		$store.mainFolder = newVal
		$db.state.currentFolder = newVal
		$db.save()
	})
	
	var ipcRenderer = require('electron').ipcRenderer

	ipcRenderer.send('request-io-update')
	ipcRenderer.send('get-folders')
	ipcRenderer.send('get-status')

	ipcRenderer.on('user-connection', function(event, data) {
		$scope.userCount = data.count
		$scope.$apply()
	})

	ipcRenderer.on('list-folders', function(event, folders) {
		$scope.folders = folders.reverse()
		$scope.$apply()
	})
	
	ipcRenderer.on('turned-on', function() {
		$scope.casting = true
		$scope.$apply()
	})
	
	ipcRenderer.on('turned-off', function() {
		$scope.casting = false
		$scope.$apply()
	})
	
	ipcRenderer.on('listening-status', function(event, listening) {
		$scope.casting = listening
		$scope.$apply()
	})
	
	$scope.toggleCasting = function() {
		if($scope.casting) {
			ipcRenderer.send('turn-off')
		} else {
			ipcRenderer.send('turn-on')
		}
	}

	$scope.openDialog = function() {
		ipcRenderer.send('open-file-dialog')
	}
	
	$scope.setFolder = function(folder) {
		$scope.mainFolder = folder
		ipcRenderer.send('drop-folder', $scope.mainFolder)
	}

	ipcRenderer.on('selected-directory', function (event, path) {
		if(path) {
			$scope.mainFolder = path
			$scope.$apply()
		}
		
		ipcRenderer.send('get-folders')
	})

	document.ondragover = document.ondrop = function(event) {
		event.preventDefault()
	}

	document.body.ondrop = function(event) {
		console.log(event.dataTransfer.files[0].path)
		event.preventDefault()
		ipcRenderer.send('drop-folder', event.dataTransfer.files[0].path)
	}
})