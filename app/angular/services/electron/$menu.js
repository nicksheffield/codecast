angular.module('app.services')

// https://github.com/electron/electron/blob/master/docs/api/menu.md
// https://github.com/electron/electron/blob/master/docs/api/menu-item.md
.factory('$menu', function($remote, $shell) {
	var Menu = $remote.Menu
	var MenuItem = $remote.MenuItem
	
	var menu = Menu.getApplicationMenu()
	
	var service = {
		currentFile: null,
		ip: null,
		openInBrowser: function(visible) {
			item.visible = visible
			Menu.setApplicationMenu(menu)
		}
	}
	
	var item = new MenuItem({label: 'Open in Browser', click: function() {
		if(service.currentFile) {
			$shell.openExternal('http://' + service.ip + ':3333/' + service.currentFile.shortpath)
		}
	}})
	
	menu.append(new MenuItem({type: 'separator'}))
	menu.append(item)
	
	Menu.setApplicationMenu(menu)
	
	window.oncontextmenu = function(e) {
		e.preventDefault()
		
		menu.popup($remote.getCurrentWindow())
		// Menu.setApplicationMenu(menu)
	}
	
	return service
})