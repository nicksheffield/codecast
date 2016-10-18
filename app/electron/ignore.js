const minimatch = require('minimatch')
const fs = require('fs')
var _ = require('lodash')

const defaults = [
	'node_modules',
	'bower_components',
	'vendor',
	'storage',
	'.git',
	'sftp_config.json',
	'project.sublime-workspace',
	'thumbs.db',
	'.DS_Store',
	'*.app',
	'*.asar',
	'*.zip',
	'*.exe',
	'*.icns'
]

// These ignores are set up per folder
var others = []

const ignore = {}

ignore.all = []

ignore.bowerrc = function(folder) {
	var ignores = []
	
	if(fs.existsSync(folder.path + '.bowerrc')) {
		var bowerrc = JSON.parse(fs.readFileSync(folder.path + '.bowerrc', "utf8"))
		
		if(bowerrc.directory) ignores.push(bowerrc.directory)
	}

	return ignores
}

ignore.sublime = function(folder) {
	var ignores = []
	
	var pattern = /[a-zA-Z0-9\_\-]+.sublime-project/
	
	var rootFiles = fs.readdirSync(folder.path)
	
	var sublimeProject = null

	_.forEach(rootFiles, function(file) {
		if(pattern.test(file)) {
			sublimeProject = JSON.parse(fs.readFileSync(folder.path + file, "utf8"))
		}
	})
	
	if(sublimeProject) {
		_.forEach(sublimeProject.folders.folder_exclude_patterns, function(folder) {
			ignores.push(folder)
		})
		_.forEach(sublimeProject.folders.file_exclude_patterns, function(file) {
			ignores.push(file)
		})
	}
	
	return ignores
}

ignore.ccignore = function(folder) {
	var ignores = []
	
	if(fs.existsSync(folder.path + '.ccignore')) {
		var fileContents = fs.readFileSync(folder.path + '.ccignore', 'utf8')
		
		var globs = fileContents.split(/\n/g)
		
		// filter out comments and empty lines
		globs = globs.filter(function(glob) {
			return glob[0] !== '#' && glob.length
		})
		
		ignores = ignores.concat(globs)
	}
	
	return ignores
}

ignore.setup = function(folder) {
	others.length = 0
	
	others = others.concat(ignore.bowerrc(folder))
	others = others.concat(ignore.sublime(folder))
	others = others.concat(ignore.ccignore(folder))
	
	ignore.all = defaults.concat(others)
}

ignore.match = function(file) {
	for(var i=0; i<ignore.all.length; i++) {
		
		var pattern = ignore.all[i]
		
		var match = minimatch(file.shortpath, pattern, {matchBase: true})
		
		if(match) {
			return true
		}
	}
	
	return false
}

module.exports = {
	ignore: ignore
}