angular.module('app.controllers')

.controller('BroadcastCtrl', function($scope, $db) {
	$scope.casting = true
	
	$scope.mainFolder = ''
	
	$scope.toggleCasting = function() {
		$scope.casting = !$scope.casting
	}
	
	var ipcRenderer = require('electron').ipcRenderer

	ipcRenderer.send('request-io-update')
	ipcRenderer.send('get-folders')

	ipcRenderer.on('user-connection', function(event, data) {
		$scope.userCount = data.count
		$scope.$apply()
	})

	ipcRenderer.on('list-folders', function(event, folders) {
		folders = folders.reverse()
		
		$scope.folders = folders.reverse()
		$scope.$apply()
	})

	$scope.openDialog = function() {
		ipcRenderer.send('open-file-dialog')
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