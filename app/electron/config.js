var Config = require('electron-config')
var config = new Config()

console.log('config path:', config.path)

if(!config.get('username')) {
	config.set('username', app.getPath('home').replace('/Users/', ''))
}

module.exports = {
	get: function(name) {
		var config = new Config()
		return config.get(name)
	},
	set: function(name, val) {
		return config.set(name, val)
	}
}