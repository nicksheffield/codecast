angular.module('app.controllers')

.controller('ViewCtrl', function($scope, $routeParams, $http, $syntax, $timeout, $socket, $remote, $menu, $config, $store) {
	$scope.fileContent = ''
	$scope.syntax = ''
	$scope.files = {}
	$scope.changed = []
	$scope.opened = []
	$scope.openFiles = $store.openFiles
	$scope.currentFile = $store.currentFile
	$scope.lightmode = $config.get('lightmode')
	
	var ip = $routeParams.ip
	var port = $routeParams.port
	var host = 'http://' + ip + ':' + port
	
	$menu.host = host
	$menu.openInBrowser(true)
	
	$scope.$watch('currentFile', function(newVal) {
		$menu.currentFile = newVal
	})
	
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

		$store.openFiles = $scope.openFiles
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

		$store.openFiles = $scope.openFiles
		$store.currentFile = $scope.currentFile
	}
	
	function get(file) {
		var split = file.name.split('.')
		
		$http.post(host + '/api/get_file', {path: file.path})
			.success(function(data) {
				if(split[split.length-1] == 'jpg' ||
				   split[split.length-1] == 'gif' ||
				   split[split.length-1] == 'png')
				{
					file.imageurl = host + '/' + file.shortpath.replace(/\s/g, '%20')
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
				
				$store.currentFile = $scope.currentFile
			})
	}

	if($scope.currentFile.path) {
		console.log('$scope.currentFile', $scope.currentFile)
		get($scope.currentFile)
	}
	
	$socket.on('connected', function() {
		console.log('Connected!')
	})
	
	$socket.on('fschange', function(data) {
		console.log('fschange', data)
		
		if($scope.currentFile.path == data.path) {
			get($scope.currentFile)
		} else {
			searchForAndChange(data.path, $scope.files)
		}
	})
	
	$socket.on('fsupdate', function() {
		console.log('fsupdate')
		load()
	})
	
	$socket.connect(host)
	
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
});