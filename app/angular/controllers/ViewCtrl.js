angular.module('app.controllers')

.controller('ViewCtrl', function($scope, $routeParams, $http, $syntax, $timeout, $socket) {
	$scope.currentFile = {}
	$scope.fileContent = ''
	$scope.syntax = ''
	$scope.files = {}
	$scope.changed = []
	$scope.opened = []
	$scope.openFiles = []
	
	var ip = $routeParams.ip
	var host = 'http://' + ip + ':3000'
	
	$scope.openingFuncs = {
		isOpen: function(file) {
			return _.indexOf($scope.opened, file.path) != -1
		},
		open: function(file) {
			$scope.opened.push(file.path)
		},
		close: function(file) {
			_.remove($scope.opened, function(path) {
				return file.path == path
			})
		},
		toggle: function(file) {
			if($scope.openingFuncs.isOpen(file)) {
				$scope.openingFuncs.close(file)
			} else {
				$scope.openingFuncs.open(file)
			}
		}
	}
	
	$scope.changingFuncs = {
		isChanged: function(file) {
			return _.indexOf($scope.changed, file.path) != -1
		},
		change: function(file) {
			$scope.changed.push(file.path)
			$scope.$apply()
		},
		unchange: function(file) {
			_.remove($scope.changed, function(path) {
				return file.path == path
			})
		}
	}

	$scope.$watch('fileContent', function(newVal, oldVal) {
		$timeout(function() {
			Prism.highlightAll()
		}, 0)
	})

	function load() {
		$http.get(host + '/api/files')
			.success(function(data) {
				$scope.files = data
				
				$scope.openingFuncs.open($scope.files[0])
			})
	}
	
	load()
	
	$scope.choose = function(file, event) {
		// handle middle click event
		if(event && event.which == 2) {
			$scope.removeFromTab(file)
		} else {
			get(file)
			// file.changed = false
			$scope.changingFuncs.unchange(file)
			if(!_.find($scope.openFiles, {path: file.path})) {
				$scope.openFiles.push(file)
			}
		}
	}
	
	$scope.removeFromTab = function(file) {
		$scope.openFiles = _.reject($scope.openFiles, {path: file.path})
		
		if($scope.currentFile.path == file.path) {
			if($scope.openFiles.length) {
				$scope.choose($scope.openFiles[0])
			} else {
				$scope.currentFile = {}
				$scope.syntax = ''
			}
		}
	}
	
	function get(file) {
		var split = file.name.split('.')
		
		$http.post(host + '/api/get_file', {path: file.path})
			.success(function(data) {
				if(split[split.length-1] == 'jpg' ||
				   split[split.length-1] == 'gif' ||
				   split[split.length-1] == 'png')
				{
					file.imageurl = 'http://' + ip + ':3333/' + file.shortpath.replace(/\s/g, '%20')
					$scope.currentFile = file
					$scope.syntax = ''
				} else {
					$scope.currentFile = file
					
					if(typeof data == 'string') {
						$scope.fileContent = data
					} else {
						$scope.fileContent = JSON.stringify(data, null, 4)
					}
					
					$scope.syntax = $syntax(file.name)
				}
			})
	}
	
	$socket.on('connected', function() {
		console.log('Connected!')
	})
	
	$socket.on('fschange', function(data) {
		console.log('fschange', data)
		
		if($scope.currentFile.path == data.path) {
			console.log($scope.currentFile.path, data.path, $scope.currentFile.path == data.path)
			get($scope.currentFile)
		} else {
			searchForAndChange(data.path, $scope.files)
		}
	})
	
	$socket.on('fsupdate', function() {
		load()
	})
	
	$socket.connect(ip)
	
	function searchForAndChange(path, files) {
		_.find(files, function(file) {
			if(file.type == 'directory') {
				searchForAndChange(path, file.files)
			} else {
				if(file.path == path) {
					// file.changed = true
					$scope.changingFuncs.change(file)
				}
			}
		})
	}
	
	
	
	var shell = require('electron').shell
	var remote = require('electron').remote
	var Menu = remote.Menu
	var MenuItem = remote.MenuItem
	

	var menu = new Menu()
	menu.append(new MenuItem({label: 'Open in Browser', click: function(){
		shell.openExternal('http://' + ip + ':3333/' + $scope.currentFile.shortpath)
	}}))

	window.addEventListener('contextmenu', function(e) {
		e.preventDefault()
		menu.popup(remote.getCurrentWindow())
	}, false)
});